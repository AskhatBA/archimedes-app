# Фискализация платежей через Webkassa

Slug: `webkassa-fiscalization`
Репозитории: backend `../archimedes-backend` (основная работа), app (минимальные правки).

## 1. Цель и контекст

Пациент платит в приложении картой через FreedomPay: платный приём (`APPOINTMENT`), корзина
платных программ (`PAID_PROGRAM`), пополнение медсчёта (`MED_ACCOUNT_TOPUP`). По закону РК на
каждую такую оплату нужен фискальный чек, зарегистрированный в ОФД. Сейчас чеков нет вообще: в
коде нет ни одного упоминания фискализации.

Задача — подключить Webkassa (облачная ККМ, протокол 2.0.4) и фискализировать каждую успешную
оплату автоматически, на бэкенде. Фискализация **не должна** ни задерживать, ни ломать сам
платёж: деньги уже списаны, и сбой Webkassa не может откатить оплату, отклонить колбэк FreedomPay
или помешать записи на приём.

Где это подключается в текущем коде:

- Единственная точка, где платёж переходит в `SUCCESS`, — `settlePayment` в
  `src/domains/payment/payment.service.ts`. Её вызывают колбэк FreedomPay (`handleCallback`) и
  сверка (`reconcilePayment`: фоновый проход, `GET /payment/status/:id`, `POST /payment/:id/cancel`).
  Переход условный (`updateMany ... where status in [...]`), поэтому срабатывает ровно один раз
  на платёж — на это и опирается фискализация.
- Обработчики назначений (`payment.success-handlers.ts`) **не подходят** как точка подключения:
  чек нужен на сам факт получения денег, а обработчик может упасть (например, МИС не записала
  на приём → `Payment.postSuccessError`), и тогда чек не появился бы на реально списанные деньги.
- Возвраты за отменённые платные приёмы: `AppointmentRefund`, который переходит в `COMPLETED` в
  `processAppointmentRefund` (FreedomPay принял `revoke.php`) или вручную оператором через
  `PATCH /appointments/admin/refunds/:id` (`updateRefund`). На возврат нужен чек «возврат
  продажи».
- Шаблон для внешних интеграций уже есть: BullMQ-очередь + воркер, запускаемые из `server.ts`;
  флаг `*_ENABLED` в `config`; статус на собственной строке в БД; очередь в дашборде
  (`med-account-credit`, `appointment-refund`, `program-order-email`).

### Что выяснено из документации Webkassa (Postman «ИНТЕГРАТОРЫ - 2.0.4»)

- Базовый URL теста: `https://devkkm.webkassa.kz`. Тестовая касса (ЗНК): `SWK00035676`.
- Каждый запрос несёт заголовок `x-api-key`. Кроме того, **`POST /api/v4/Authorize` требует
  `Login` (email) и `Password` пользователя-кассира** и возвращает `Data.Token`; дальше `Token`
  передаётся в теле каждого запроса. Значит, одного API-ключа недостаточно (см. решение 8.1).
- `POST /api/v4/check` — фискализация. Основные поля: `Token`, `CashboxUniqueNumber`,
  `OperationType` (2 — продажа, 3 — возврат продажи), `Positions[]` (`Count`, `Price`,
  `TaxType` 0/100, `TaxPercent`, `Tax`, `PositionName`, `PositionCode`, `PositionType`
  0/1/2 — **обязателен для протокола 2.0.4**, `UnitCode`), `Payments[]` (`Sum`, `PaymentType`
  0 — наличные, 1 — карта, 4 — мобильный платёж), `RoundType`, `ExternalCheckNumber`
  (обязателен, **ключ идемпотентности**), `ExternalOrderNumber`, `CustomerEmail` (Webkassa сама
  отправляет чек на email), `CustomerPhone`, `CustomerXin`.
- Ответ: `CheckNumber` (фискальный признак), `DateTime`/`DateTimeUTC`, `OfflineMode`,
  `Cashbox.RegistrationNumber` (РНК), `CheckOrderNumber`, `ShiftNumber`, `TicketUrl` (ссылка ОФД,
  она же QR), `TicketPrintUrl` (печатная форма Webkassa), `Total`.
- Возврат (`OperationType: 3`) для протокола ≥ 2.0.3 обязательно содержит `ReturnBasisDetails`:
  `CheckNumber`, `RegistrationNumber`, `DateTime` (`YYYY-MM-DD HH:mm:ss`), `Total`, `IsOffline`
  чека-основания. Значит, эти поля чека продажи нужно сохранять.
- Повтор с тем же `ExternalCheckNumber` возвращает ошибку `14` **вместе с `Data` уже
  зарегистрированного чека**. Поэтому, в отличие от `revoke.php`, повторы здесь безопасны.
- Смена открывается автоматически первой операцией. Закрывается Z-отчётом
  `POST /api/v4/ZReport`. Смена дольше 24 часов → ошибка `11` на любой операции.
- **Все запросы по одной кассе — строго последовательно** (параллельные дают ошибку `9`,
  вариация 2).
- Коды ошибок: `1` неверный логин/пароль, `2` сессия истекла, `3` не авторизован, `4`/`5` нет
  прав, `6` касса не найдена, `7` заблокирована, `9` валидация, `10` не активирована, `11` смена
  > 24 ч, `12` смена уже закрыта, `13` нет открытой смены, `14` дубль `ExternalCheckNumber`,
  `16` чек не найден, `18` автономный режим > 72 ч, `505` домен недоступен (альтернативные хосты
  приходят в заголовке ответа `AlternativeDomainNames`), `-1` неизвестная.
- Единица измерения для услуги: `UnitCode: 5114` («одн.усл.») из справочника `RefUnits`.
- Требование «чек на казахском и русском» относится к печатной/электронной форме, которую
  формирует интегратор. Мы свою форму **не рисуем**: пациенту отдаётся ссылка ОФД/Webkassa,
  поэтому требование выполняет их сторона.

## 2. Объём

В объёме:

1. Чек продажи на каждый платёж, который перешёл в `SUCCESS`, для назначений из
   `WEBKASSA_FISCALIZE_PURPOSES` (по умолчанию `APPOINTMENT,PAID_PROGRAM,MED_ACCOUNT_TOPUP`).
2. Чек возврата продажи на каждый `AppointmentRefund`, перешедший в `COMPLETED` с `amount > 0`.
3. Хранение реквизитов чека, повторы, автозакрытие смены, ежедневный Z-отчёт.
4. Очередь чеков для дашборда (API) с ручным повтором и ручным закрытием смены.
5. Ссылка на чек в приложении: история записей и история пополнений медсчёта.

Вне объёма:

- UI дашборда (отдельный репозиторий `archimedes-dashboard`). Здесь описано только API.
- Наличные, внесение/изъятие, X-отчёты, маркировка, курьерские заказы.
- Чеки на платежи, прошедшие до запуска (бэкфилл) — решение 8.12.
- Возвраты, которые оператор провёл в кабинете FreedomPay в обход `AppointmentRefund`
  (например, после неудачной записи в МИС). Их чек возврата пробивается вручную в кабинете Webkassa.

## 3. Пользовательские сценарии

**С1. Оплата приёма.** Пациент оплачивает приём → FreedomPay присылает колбэк → платёж `SUCCESS`
→ колбэк сразу получает подписанный `ok` (как сейчас) → в течение нескольких секунд воркер
регистрирует чек продажи в Webkassa. Если у пользователя есть `email`, Webkassa отправляет чек на
почту. В «Истории записей» у карточки приёма появляется ссылка «Чек».

**С2. Пополнение медсчёта.** То же, что С1; ссылка «Чек» появляется в истории пополнений.

**С3. Платные программы.** То же, что С1; в чеке по позиции на каждую программу из корзины. В
приложении списка заказов нет, поэтому ссылка видна только в дашборде (и приходит на email, если он есть).

**С4. Отмена платного приёма с возвратом.** Пациент отменяет приём → `AppointmentRefund` →
FreedomPay принимает возврат → `COMPLETED` → воркер пробивает чек возврата на сумму возврата
(100% или 70%) со ссылкой на чек продажи. В карточке отменённого приёма появляется «Чек возврата».

**С5. Webkassa недоступна.** Платёж, запись и пополнение проходят как обычно. Чек остаётся
`PENDING`, воркер повторяет с паузами; после исчерпания попыток — `FAILED`, его видно в очереди
дашборда, оператор нажимает «Повторить».

**С6. Смена > 24 часов.** Webkassa отвечает `11` → воркер закрывает смену Z-отчётом и повторяет чек
один раз, без участия человека. Штатно смена закрывается ежедневным Z-отчётом по расписанию.

**С7. Повторный колбэк / гонка колбэка и сверки.** Второй чек не создаётся: строка чека создаётся
только победителем условного перехода в `SUCCESS`, а `ExternalCheckNumber` уникален и в нашей БД,
и в Webkassa.

## 4. Изменения в backend

### 4.1. Конфигурация (`src/config/index.ts`, `.env.example`)

Новый блок `config.webkassa`:

| Переменная | По умолчанию | Назначение |
|---|---|---|
| `WEBKASSA_ENABLED` | `true` в коде, `false` в `.env.example` | Выключатель отправки. При `false` строки чеков создаются в `PENDING`, но в Webkassa ничего не отправляется (так же устроены `MED_ACCOUNT_CREDIT_ENABLED` и `APPOINTMENT_REFUND_ENABLED`). |
| `WEBKASSA_API_URL` | `https://devkkm.webkassa.kz` | Базовый URL. Прод-URL — решение 8.10. |
| `WEBKASSA_API_KEY` | — | **Секрет.** Только в `.env` бэкенда, никогда в git, `.env.example` или логах. В `.env.example` — пустое значение. |
| `WEBKASSA_LOGIN` / `WEBKASSA_PASSWORD` | — | **Секрет.** Учётка кассира для `/api/v4/Authorize`. В `.env.example` — пустые значения. |
| `WEBKASSA_CASHBOX_UNIQUE_NUMBER` | — | ЗНК. Для dev в `.env.example` можно указать `SWK00035676`: номер кассы не секрет. |
| `WEBKASSA_FISCALIZE_PURPOSES` | `APPOINTMENT,PAID_PROGRAM,MED_ACCOUNT_TOPUP` | Какие назначения платежей фискализируются. |
| `WEBKASSA_TAX_TYPE` | `100` | `0` — без НДС, `100` — НДС. Клиника — плательщик НДС (решение 8.2). |
| `WEBKASSA_TAX_PERCENT` | `16` | Ставка НДС, обязательна при `TAX_TYPE=100`. |
| `WEBKASSA_PAYMENT_TYPE` | `1` | Тип оплаты в чеке (1 — банковская карта). |
| `WEBKASSA_SEND_CUSTOMER_PHONE` | `true` | Передавать ли `CustomerPhone`. |
| `WEBKASSA_SHIFT_CLOSE_CRON` | `55 23 * * *` | Ежедневный Z-отчёт, в часовом поясе `Asia/Almaty`. Пусто — расписание снимается. |
| `WEBKASSA_TOKEN_TTL_MINUTES` | `600` | Сколько держать токен в Redis до принудительной переавторизации. |
| `WEBKASSA_MAX_ATTEMPTS` | `8` | Попыток на один чек до `FAILED`. |
| `WEBKASSA_SWEEP_INTERVAL_SECONDS` | `300` | Проход, который подбирает потерянные `PENDING`. |

`config` при старте проверяет: если `WEBKASSA_ENABLED=true`, а ключа, логина, пароля или ЗНК нет,
пишется `error` в лог, и воркер не отправляет запросы (по аналогии с `assertConfigured` у
FreedomPay). Сервер при этом не падает.

Если `FREEDOMPAY_TESTING_MODE=true`, а `WEBKASSA_API_URL` не devkkm, воркер отказывается
отправлять чеки и пишет `error`: тестовые оплаты не должны попадать в боевую кассу.

### 4.2. Схема Prisma и миграция

Новая миграция `20261008120000_webkassa_fiscal_receipts`.

```prisma
enum FiscalOperationType {
  /// Продажа — OperationType 2.
  SALE
  /// Возврат продажи — OperationType 3.
  SALE_RETURN
}

enum FiscalReceiptStatus {
  /// Создан, ещё не зарегистрирован в Webkassa (ждёт очереди, повтора или включения флага).
  PENDING
  /// Зарегистрирован, фискальный признак получен.
  ISSUED
  /// Webkassa отказала или исчерпаны попытки. Нужен оператор.
  FAILED
}

/// Фискальный чек на движение денег по платежу: продажа на оплату, возврат на возврат.
model FiscalReceipt {
  id                  String              @id @default(uuid()) @db.Uuid
  paymentId           String              @db.Uuid
  /// Только для SALE_RETURN — какой возврат он фиксирует.
  refundId            String?             @unique @db.Uuid
  userId              String              @db.Uuid
  operationType       FiscalOperationType
  status              FiscalReceiptStatus @default(PENDING)
  /// Ключ идемпотентности в Webkassa: Payment.id для продажи, AppointmentRefund.id для возврата.
  externalCheckNumber String              @unique
  /// Сумма чека, тенге.
  amount              Float
  cashboxUniqueNumber String
  /// Что ушло в Webkassa: Positions/Payments/TaxType, без контактов покупателя.
  positions           Json?
  // --- реквизиты из ответа Webkassa ---
  checkNumber         String?   /// Фискальный признак (CheckNumber)
  registrationNumber  String?   /// РНК кассы — нужен для ReturnBasisDetails
  checkOrderNumber    Int?
  shiftNumber         Int?
  offlineMode         Boolean?
  fiscalizedAt        DateTime? /// DateTimeUTC из ответа
  ticketUrl           String?   /// Ссылка ОФД (QR)
  ticketPrintUrl      String?   /// Печатная форма Webkassa
  // --- диагностика ---
  attempts            Int       @default(0)
  lastErrorCode       Int?
  lastError           String?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  payment Payment            @relation(fields: [paymentId], references: [id], onDelete: Restrict)
  refund  AppointmentRefund? @relation(fields: [refundId], references: [id], onDelete: Restrict)
  user    User               @relation(fields: [userId], references: [id], onDelete: Restrict)

  @@index([paymentId])
  @@index([status, createdAt])
  @@index([userId])
  @@index([createdAt])
}
```

Обратные связи: `Payment.fiscalReceipts FiscalReceipt[]`,
`AppointmentRefund.fiscalReceipt FiscalReceipt?`, `User.fiscalReceipts FiscalReceipt[]`.

`onDelete: Restrict` выбран намеренно: фискальный документ юридически значим и неизменяем, он не
должен исчезать каскадом при удалении пользователя или платежа. Если где-то есть жёсткое удаление
`User` или `Payment`, его нужно проверить: сейчас там `Cascade` (решение 8.13).

Защита от дубля — `externalCheckNumber @unique`: он детерминированно выводится из `Payment.id` (продажа) или `AppointmentRefund.id` (возврат). Составной уникальный индекс с `refundId` не нужен: у продажи `refundId = NULL`, а Postgres считает `NULL` различными значениями, так что такой индекс продажу не защитил бы.

`AuditEvent` пополняется: `FISCAL_RECEIPT_ISSUED`, `FISCAL_RECEIPT_FAILED`,
`FISCAL_RECEIPT_RETRIED`, `FISCAL_SHIFT_CLOSED`.

### 4.3. Новый домен `src/domains/fiscal/`

- `webkassa.client.ts` — HTTP-клиент: `axios` с `baseURL = config.webkassa.apiUrl`, таймаут
  20 с и заголовок `x-api-key` на каждом запросе.
  - `authorize()` → `POST /api/v4/Authorize { Login, Password }`. Токен кэшируется в Redis
    (`webkassa:token`, TTL `WEBKASSA_TOKEN_TTL_MINUTES`).
  - `withToken(fn)` — подставляет `Token`; на ошибке `2`/`3` сбрасывает кэш, переавторизуется и
    повторяет запрос **один** раз.
  - `createCheck(body)`, `closeShift()` (`/api/v4/ZReport`),
    `getTicketByExternalCheckNumber(ext, shift)` (диагностика).
  - Ответ с непустым `Errors[]` — ошибка независимо от HTTP-статуса. Ошибка разбирается в
    `WebkassaError { code, text, retryable, data? }`.
  - `505`: если в ответе есть заголовок `AlternativeDomainNames`, запрос повторяется по очереди на
    альтернативные хосты в рамках той же попытки.
- `webkassa.types.ts` — типы запросов и ответов (PascalCase, как в документации).
- `fiscal.positions.ts` — сборка `Positions` по назначению платежа (см. 4.5).
- `fiscal.service.ts`:
  - `createSaleReceiptInTx(tx, payment)` — создаёт строку `SALE/PENDING` внутри транзакции
    `settlePayment`.
  - `createReturnReceipt(refund)` — создаёт `SALE_RETURN/PENDING` и ставит её в очередь.
  - `issueReceipt(receiptId)` — сама регистрация. **Никогда не бросает** наружу: исход
    записывается в строку.
  - `closeShift()` — Z-отчёт.
  - `sweepPendingReceipts()` — переотправка потерянных.
- `fiscal.admin.service.ts`, `fiscal.controller.ts`, `fiscal.routes.ts`, `fiscal.dto.ts` — API
  дашборда (4.7). Домен регистрируется в `src/routes.ts` как `/v1/api/fiscal`.

### 4.4. Точка подключения: оплата

В `settlePayment` (`payment.service.ts`), **в той же транзакции**, где платёж переходит в
`SUCCESS` (`count > 0`), если `payment.purpose ∈ WEBKASSA_FISCALIZE_PURPOSES` и `amount > 0`,
создаётся `FiscalReceipt { operationType: SALE, status: PENDING, externalCheckNumber: payment.id,
amount: payment.amount }`. Чек создаётся при любом значении `WEBKASSA_ENABLED`.

После коммита (рядом с `runPostPaymentSuccess`, в отдельном `try/catch`) вызывается
`enqueueFiscalReceipt(receiptId)`. Ошибка постановки в очередь логируется и проглатывается: строка
уже записана, и проход-сверка (4.6) её подберёт.

Почему в транзакции, а не в обработчике назначения:

- чек появляется ровно тогда, когда деньги признаны полученными, и ровно один раз — это
  гарантирует тот же условный `updateMany`;
- чек не зависит от успеха обработчика назначения (МИС, страховая);
- если процесс упадёт между коммитом и постановкой в очередь, строка не потеряется.

Колбэк FreedomPay **не ждёт** Webkassa: в транзакции — одна вставка в БД, в очередь — одна команда
Redis.

### 4.5. Состав чека

Общие поля для продажи:

- `OperationType: 2`, `CashboxUniqueNumber` из конфига, `ExternalCheckNumber = receipt.externalCheckNumber`,
  `ExternalOrderNumber = payment.id`.
- `RoundType: 0` (позиции и итог до 2 знаков). `Payment.amount` — `Float`, а сумма
  `APPOINTMENT` приходит от клиента и может быть дробной; округление до целого (`RoundType 2`,
  значение по умолчанию у Webkassa) дало бы расхождение с суммой, списанной FreedomPay.
- `Payments: [{ Sum: payment.amount, PaymentType: WEBKASSA_PAYMENT_TYPE }]`, `Change: 0`.
- Каждая позиция: `Count: 1`, `UnitCode: 5114`, `PositionType: 2` (услуга),
  `TaxType`/`TaxPercent` из конфига, `Tax` по формуле Webkassa
  `Price * p / (100 + p)`, округлённый до сотых (при `TaxType 0` — `0`).
- `CustomerPhone`: `User.phone` в формате `+7XXXXXXXXXX`, если `WEBKASSA_SEND_CUSTOMER_PHONE`.
  `CustomerEmail`: `User.email`, если есть (тогда Webkassa отправит чек на почту). `CustomerXin`:
  ИИН пациента (`Patient.iin`), если в нём ровно 12 цифр (решение 8.6).
- Сумма `Price` по позициям **обязана** совпадать с `payment.amount` (с точностью до 0,005).

Позиции по назначению (`fiscal.positions.ts`, берутся из `payment.metadata`, проверенной на init):

| Назначение | Позиции |
|---|---|
| `APPOINTMENT` | Одна позиция. `PositionName`: `metadata.serviceName`, иначе «Онлайн-консультация врача» при `isTelemedicine`, иначе «Приём врача». `PositionCode`: `metadata.medicServiceOid`, если есть. `Price = payment.amount`. |
| `PAID_PROGRAM` | По позиции на `metadata.items[i]`: `PositionName = title`, `PositionCode = code`, `Price = price`. Если сумма не сходится с `amount` (init это уже проверял, так что это сбой), в чек идёт одна сводная позиция «Оплата платных программ» на всю сумму, и пишется `warn`. |
| `MED_ACCOUNT_TOPUP` | Одна позиция «Пополнение медицинского счёта», `Price = payment.amount`. Фискализируется чеком продажи (решение 8.3). |
| `BALANCE_TOPUP` | Не фискализируется по умолчанию (нет в `WEBKASSA_FISCALIZE_PURPOSES`). |

`PositionName` обрезается до безопасной длины (128 символов). Снимок `Positions`/`Payments` без
контактов покупателя сохраняется в `receipt.positions`.

### 4.6. Очередь, воркер, смены, повторы

Одна очередь BullMQ `webkassa` для **всех** операций с кассой — и чеков, и Z-отчётов: у
Webkassa требование строго последовательных запросов по кассе.

- Воркер `webkassa.worker.ts`: `concurrency: 1`, а при старте — `queue.setGlobalConcurrency(1)`,
  чтобы последовательность держалась и при нескольких экземплярах бэкенда. Запускается и
  останавливается в `server.ts` по образцу остальных воркеров.
- Задачи:
  - `issue-receipt` `{ receiptId }`, `jobId = fiscal-receipt-<receiptId>-<retryRound>`.
    Без `retryRound` повтор из дашборда не поставился бы: BullMQ отвергает уже существующий `jobId`;
  - `close-shift` — по расписанию `upsertJobScheduler` с `pattern = WEBKASSA_SHIFT_CLOSE_CRON`,
    `tz: 'Asia/Almaty'`;
  - `sweep` — каждые `WEBKASSA_SWEEP_INTERVAL_SECONDS`: ставит в очередь `PENDING` старше 2 минут
    (дедупликация по `jobId`). Так покрывается потерянная постановка и включение флага после простоя.
- Повторы делаются через `attempts: WEBKASSA_MAX_ATTEMPTS` и `backoff: exponential, 30 s`. Здесь
  это безопасно, в отличие от `appointment-refund` с его `attempts: 1`: повтор с тем же
  `ExternalCheckNumber` не создаёт второй чек, а возвращает ошибку `14` с данными первого.

Алгоритм `issueReceipt(receiptId)`:

1. Строка не `PENDING` → ничего не делать (уже выпущен или ждёт оператора).
2. `WEBKASSA_ENABLED=false` или конфиг неполный → оставить `PENDING`, залогировать, завершить
   без ошибки.
3. Для `SALE_RETURN`: чек продажи того же платежа должен быть `ISSUED`. Если он `PENDING` —
   бросить ретраибл-ошибку (задача повторится позже). Если `FAILED` или его нет — записать
   `lastError` «Нет чека продажи — сначала нужно выпустить его», задачу повторять дальше; после
   исчерпания попыток — `FAILED`.
4. `attempts += 1`, собрать тело, отправить `POST /api/v4/check`.
5. Разбор исхода:
   - Успех **или** код `14` с `Data` → `ISSUED`, сохранить реквизиты, очистить `lastError`,
     аудит `FISCAL_RECEIPT_ISSUED`. `OfflineMode: true` — тоже `ISSUED`, флаг сохраняется.
   - `2`/`3` → переавторизация внутри клиента (см. 4.3).
   - `11` → в том же задании `closeShift()`, затем один повтор `createCheck`.
   - `13` при Z-отчёте → смены нет, закрывать нечего, это не ошибка.
   - Сеть, таймаут, HTTP 5xx, `-1`, `505`, `9` с текстом про последовательность, `18` →
     ретраибл: записать `lastErrorCode/lastError`, бросить ошибку, BullMQ повторит. Строка остаётся `PENDING`.
   - `1`, `4`, `5`, `6`, `7`, `10`, `9` (валидация) → **не повторять**: сразу `FAILED`,
     аудит `FISCAL_RECEIPT_FAILED`, `error`-лог (Sentry).
   - Последняя попытка исчерпана → `FAILED` с последней ошибкой (через `worker.on('failed')`
     при `attemptsMade >= attempts`).
6. Наружу функция ошибку не пробрасывает, кроме намеренной ретраибл-ошибки для BullMQ.

Z-отчёт (`closeShift`): `POST /api/v4/ZReport`. `12`/`13` → смены нет, это не ошибка. Успех →
аудит `FISCAL_SHIFT_CLOSED` с `ShiftNumber`. Ошибка → `error`-лог; следующий чек при `11`
закроет смену сам.

### 4.7. Точка подключения: возврат

`createReturnReceipt(refund)` вызывается при переходе `AppointmentRefund` в `COMPLETED`:

- в `processAppointmentRefund`, ветка `outcome.result === 'accepted'`, после `settle(...)`;
- в `updateRefund` (дашборд), когда оператор переводит строку в `COMPLETED`;
- **не** вызывается при `amount <= 0` (удержано 100%, денег не вернули) и при `pending` от FreedomPay.

Чек возврата: `OperationType: 3`, `ExternalCheckNumber = refund.id`, одна позиция с тем же
`PositionName`/`PositionCode`, что у продажи (берётся из `sale.positions`), `Price = refund.amount`,
`Payments[0].Sum = refund.amount`, `ReturnBasisDetails`:

```json
{
  "CheckNumber": "<sale.checkNumber>",
  "RegistrationNumber": "<sale.registrationNumber>",
  "DateTime": "<sale.fiscalizedAt в Asia/Almaty, YYYY-MM-DD HH:mm:ss>",
  "Total": "<sale.amount>",
  "IsOffline": "<sale.offlineMode>"
}
```

Создание строки возврата идемпотентно: `refundId @unique`. Повторный вызов (оператор дважды
сохранил `COMPLETED`) ловит конфликт уникальности и ничего не делает. Ошибка создания или
постановки в очередь логируется и не влияет на статус возврата.

### 4.8. API

**Дашборд** (все с `authenticate` + `requireRole(Role.ADMIN)`, `/admin` регистрируется раньше
`/:id`):

- `GET /v1/api/fiscal/admin/receipts?page&limit&status&operationType&dateFrom&dateTo&search` —
  список с пагинацией; `search` — по ФИО/ИИН/телефону пациента, `paymentId`, `pgPaymentId`,
  `checkNumber`. Каждая строка: поля `FiscalReceipt` (без `positions`), `purpose` платежа,
  `pgPaymentId`, пациент (имя, ИИН, телефон — как в соседних admin-списках). В ответе также
  `totalAmount` по фильтру.
- `GET /v1/api/fiscal/admin/receipts/:id` — то же плюс `positions`.
- `POST /v1/api/fiscal/admin/receipts/:id/retry` — только для `FAILED`: `status = PENDING`,
  `attempts = 0`, постановка в очередь с новым `retryRound`. Аудит `FISCAL_RECEIPT_RETRIED`.
  Ответ — строка.
- `POST /v1/api/fiscal/admin/shift/close` — ручной Z-отчёт через ту же очередь (ответ ждёт
  завершения задачи, до 30 с). Ответ: `{ shiftNumber | null, closed: boolean }`.

**Ошибки** (`ErrorCodes`, ответ `{ success: false, message }`):

| Код | HTTP | Когда |
|---|---|---|
| `FISCAL_RECEIPT_NOT_FOUND` | 404 | нет такого чека |
| `FISCAL_RECEIPT_NOT_RETRYABLE` | 409 | повтор не-`FAILED` чека |
| `WEBKASSA_DISABLED` | 409 | ручное закрытие смены при выключенном флаге или неполном конфиге |
| `WEBKASSA_UNAVAILABLE` | 502 | Webkassa не ответила при ручном закрытии смены |

**Для приложения** (расширение существующих ответов, новых эндпоинтов нет):

- `GET /v1/api/appointments/history` — у элемента `receiptUrl: string | null` (`ticketUrl` чека
  `SALE/ISSUED` платежа) и `refund.receiptUrl: string | null` (`ticketUrl` чека
  `SALE_RETURN/ISSUED`). Чтение — тем же запросом (`include`), без N+1.
- `GET /v1/api/med-account/topups` — `receiptUrl: string | null`.
- `GET /v1/api/program-orders`, `/:id` — `receiptUrl: string | null` (для дашборда и на будущее).
- Swagger-описания обновляются.

Пока чек не `ISSUED`, `receiptUrl = null`. Статусы `PENDING`/`FAILED` пациенту не показываются: он
ничего не может с ними сделать, это работа оператора.

### 4.9. Логи и безопасность

- В `SENSITIVE_KEYS` (`src/shared/lib/logger/redact.ts`) добавляются `Token`, `Password`,
  `Login`, `x-api-key`, `CustomerPhone`, `CustomerEmail`, `CustomerXin`, `customerPhone`,
  `customerEmail`, `customerXin`: Webkassa пишет поля в PascalCase, а текущий список их не ловит.
- Тело запроса и ответа целиком не логируется. Пишутся `receiptId`, `paymentId`,
  `externalCheckNumber`, код и текст ошибки, `checkNumber`, `shiftNumber`.
- Значение `WEBKASSA_API_KEY` не попадает ни в один файл репозитория.
- `CLAUDE.md` бэкенда дополняется разделом «Fiscal receipts (Webkassa)» в стиле соседних.

## 5. Изменения в приложении

Изменения минимальные: новых экранов, роутов и хуков нет. Пациенту нужна только возможность
открыть чек там, где он уже видит свою оплату. Свою форму чека не рисуем, иначе на нас перешли бы
требования к её составу и двуязычию.

- `src/api/appointment-api.ts`: в `AppointmentHistoryItem` добавить `receiptUrl: string | null`;
  в `refund` (Pick) — `receiptUrl: string | null`.
- `src/modules/appointment/components/booking-history/ui/booking-history-card.tsx`:
  - при `receiptUrl` — текстовая ссылка «Чек об оплате»;
  - при `refund?.receiptUrl` — «Чек возврата»;
  - нажатие → `Linking.openURL(url)`; если не открылось, тост «Не удалось открыть чек».
  - При `null` ничего не рисуется.
- `src/modules/med-account/types.ts`: в `Topup` добавить `receiptUrl: string | null`.
  `src/modules/med-account/components/topup-history-card.tsx` — та же ссылка «Чек об оплате».
- i18n (`ru.json`, `kk.json`, `en.json`) — новые ключи:
  - `receipt.sale`: «Чек об оплате» / «Төлем чегі» / «Payment receipt»;
  - `receipt.return`: «Чек возврата» / «Қайтару чегі» / «Refund receipt»;
  - `receipt.openFailed`: «Не удалось открыть чек» / «Чекті ашу мүмкін болмады» / «Couldn't open the receipt».
  
  Казахский текст должен проверить носитель языка.
- Инвалидация запросов не нужна: история и так перезапрашивается, а ссылка появляется при
  следующей загрузке.
- Тесты: `booking-history/ui/__tests__` — карточка со ссылкой и без неё.
- Раздел «Fiscal receipts» в `CLAUDE.md` приложения: одна-две фразы о том, где ссылка и откуда она берётся.

## 6. Критерии приёмки

Бэкенд — создание и идемпотентность:

- **AC-1.** Платёж с назначением из `WEBKASSA_FISCALIZE_PURPOSES`, перешедший в `SUCCESS`
  (колбэк или сверка), имеет ровно одну строку `FiscalReceipt { operationType: SALE,
  externalCheckNumber: payment.id, amount: payment.amount }`.
- **AC-2.** Повторный колбэк FreedomPay и гонка «колбэк + сверка» по одному платежу не создают
  второй строки `SALE` и не отправляют в Webkassa второй чек.
- **AC-3.** Платёж, перешедший в `FAILED`/`CANCELLED`, и платёж с назначением не из списка (по
  умолчанию `BALANCE_TOPUP`) строки чека не получают.
- **AC-4.** Ответ на колбэк FreedomPay не меняется (подписанный XML `ok`) и не ждёт Webkassa: при
  недоступной Webkassa колбэк отвечает так же быстро, как без фискализации.
- **AC-5.** Если обработчик назначения упал (`postSuccessError` заполнен), чек продажи всё равно
  создаётся и выпускается.

Бэкенд — выпуск:

- **AC-6.** При включённом флаге и доступном тестовом стенде чек продажи в течение 30 с переходит
  в `ISSUED`, и у него заполнены `checkNumber`, `registrationNumber`, `shiftNumber`,
  `checkOrderNumber`, `fiscalizedAt`, `ticketUrl`, `ticketPrintUrl`. Чек виден в кабинете
  devkkm по кассе `SWK00035676`.
- **AC-7.** В запросе к `/api/v4/check` у каждой позиции `PositionType = 2`, `UnitCode = 5114`, а
  сумма `Price * Count` по позициям равна `Payments[0].Sum` и `payment.amount`.
- **AC-8.** Для `PAID_PROGRAM` с N программами в чеке N позиций с названиями и ценами из корзины.
- **AC-9.** Повторная отправка задачи с тем же `ExternalCheckNumber` (смоделированная потеря
  ответа) переводит строку в `ISSUED` с реквизитами исходного чека (обработка кода `14`), и в
  кассе остаётся один чек.
- **AC-10.** При `WEBKASSA_ENABLED=false` строки создаются в `PENDING` и не отправляются. После
  включения флага проход-сверка выпускает их без ручных действий.
- **AC-11.** При недоступной Webkassa (сеть, 5xx) чек остаётся `PENDING` с `lastError`, повторяется
  с экспоненциальной паузой и после `WEBKASSA_MAX_ATTEMPTS` попыток переходит в `FAILED`.
- **AC-12.** При ошибке валидации (`9`) или ошибке прав/кассы (`1`, `4`, `5`, `6`, `7`, `10`)
  чек сразу переходит в `FAILED` без повторов; пишутся `error`-лог и аудит `FISCAL_RECEIPT_FAILED`.
- **AC-13.** При истёкшем или невалидном токене (`2`/`3`) клиент переавторизуется и повторяет
  запрос один раз; чек выпускается без перехода в `FAILED`.
- **AC-14.** При ошибке `11` воркер выполняет Z-отчёт и повторяет чек; чек выпускается в новой смене.
- **AC-15.** По расписанию `WEBKASSA_SHIFT_CLOSE_CRON` (Asia/Almaty) выполняется Z-отчёт. Если
  открытой смены нет (`12`/`13`), задача завершается успешно без ошибки в логах уровня `error`.
- **AC-16.** Запросы к Webkassa никогда не выполняются параллельно: при 10 одновременно
  оплаченных платежах в логах нет ошибки `9` про последовательность, и все 10 чеков выпущены.

Бэкенд — возвраты:

- **AC-17.** Отмена платного приёма с возвратом, принятым FreedomPay (`COMPLETED`), создаёт ровно
  один `SALE_RETURN` с `refundId`, `externalCheckNumber = refund.id`, `amount = refund.amount`.
  После выпуска в запросе есть `ReturnBasisDetails` с реквизитами чека продажи.
- **AC-18.** Возврат 70% (поздняя отмена) даёт чек возврата на 70% суммы; чек продажи на 100% не
  меняется.
- **AC-19.** Возврат с `amount = 0`, возврат в статусе `PENDING`/`FAILED` и `pending` от FreedomPay
  чек возврата не создают.
- **AC-20.** Ручной перевод возврата в `COMPLETED` в дашборде создаёт чек возврата; повторное
  сохранение `COMPLETED` второго не создаёт.
- **AC-21.** Чек возврата не отправляется, пока чек продажи не `ISSUED`, и выпускается
  автоматически, когда чек продажи выпущен (в пределах попыток).

Бэкенд — API и безопасность:

- **AC-22.** `GET /fiscal/admin/receipts` отдаёт пагинированный список с фильтрами и `totalAmount`;
  токен пациента получает 403.
- **AC-23.** `POST /fiscal/admin/receipts/:id/retry` для `FAILED` ставит чек в очередь и при
  доступной Webkassa выпускает его; для `ISSUED`/`PENDING` отвечает 409
  `FISCAL_RECEIPT_NOT_RETRYABLE`.
- **AC-24.** `GET /appointments/history` и `GET /med-account/topups` возвращают `receiptUrl` (и
  `refund.receiptUrl`) равным `ticketUrl` выпущенного чека, иначе `null`.
- **AC-25.** Ни в логах, ни в репозитории нет значений `WEBKASSA_API_KEY`, `WEBKASSA_PASSWORD`,
  токена Webkassa, телефона, email или ИИН покупателя (проверка: прогон оплаты с `LOG_LEVEL=debug`
  и поиск по логу).
- **AC-26.** При `FREEDOMPAY_TESTING_MODE=true` и не-dev `WEBKASSA_API_URL` чеки не отправляются,
  в логе есть `error`.

Приложение:

- **AC-27.** В «Истории записей» у оплаченного приёма с выпущенным чеком есть «Чек об оплате»,
  который открывает `receiptUrl` во внешнем браузере. Без чека ссылки нет, вёрстка карточки не
  меняется.
- **AC-28.** У отменённого приёма с выпущенным чеком возврата есть «Чек возврата».
- **AC-29.** В истории пополнений медсчёта у пополнения с выпущенным чеком есть «Чек об оплате».
- **AC-30.** Если `Linking.openURL` отклонён, показывается тост «Не удалось открыть чек».
- **AC-31.** `npm run lint` и `npm test` в приложении зелёные; тест карточки истории покрывает
  оба варианта (со ссылкой и без).

## 7. Краевые случаи и ошибки

| Ситуация | Поведение |
|---|---|
| Webkassa недоступна, таймаут | `PENDING`, повтор с паузой, после лимита `FAILED` → очередь дашборда |
| Ответ потерян, а чек в Webkassa создан | повтор с тем же `ExternalCheckNumber` → код `14` + `Data` → `ISSUED` |
| `14` без `Data` | `FAILED` с текстом «Чек уже зарегистрирован, реквизиты не получены — проверьте в кабинете Webkassa» |
| Смена > 24 ч (`11`) | автоматический Z-отчёт и повтор |
| Автономный режим (`OfflineMode: true`) | `ISSUED`, `offlineMode = true`; ссылка ОФД может открыться не сразу |
| Автономный режим > 72 ч (`18`) | повторяется; после лимита `FAILED` и `error`-лог (Sentry) |
| `505` | перебор хостов из `AlternativeDomainNames`, иначе повтор |
| Касса заблокирована / не активирована (`7`/`10`) | `FAILED` сразу, `error`-лог (Sentry); в API не решается, нужен ЦТО |
| Неверные логин/пароль (`1`) | `FAILED` сразу; в лог один `error`, без пароля |
| Обработчик назначения упал, деньги взяты | чек продажи выпускается (деньги получены); дальнейший возврат — вручную, вне объёма |
| Сумма позиций `PAID_PROGRAM` ≠ `amount` | одна сводная позиция на всю сумму + `warn` |
| Возврат раньше, чем выпущен чек продажи | чек возврата ждёт (ретраи); при `FAILED` продажи — `FAILED` с пояснением |
| Двойное сохранение `COMPLETED` возврата | уникальность `refundId`, второй чек не создаётся |
| Удаление пользователя/платежа при наличии чеков | `Restrict` не даст удалить; решение 8.13 |
| Ручной повтор, пока задача ещё в очереди | 409 `FISCAL_RECEIPT_NOT_RETRYABLE` (строка не `FAILED`) |
| Приложение: ссылка не открывается | тост «Не удалось открыть чек» |

## 8. Открытые вопросы → решения

Ответы получены от заказчика 2026-10-07. Вопросы 1–4 решены явно, по 5–14 приняты значения
по умолчанию, предложенные в этой спецификации.

1. **Учётка кассира — решено.** Для тестовой Webkassa (`https://devkkm.webkassa.kz`, касса
   `SWK00035676`) выдана учётка кассира и API-ключ. Значения лежат **только** в локальном `.env`
   бэкенда (`WEBKASSA_API_KEY`, `WEBKASSA_LOGIN`, `WEBKASSA_PASSWORD`), в git, `.env.example`,
   спецификации, тестах и логах их нет — там только плейсхолдеры. Боевая учётка — см. п. 10.
2. **НДС — решено.** Клиника — плательщик НДС, ставка 16% на все услуги: приёмы, платные
   программы и пополнение медсчёта. Поэтому по умолчанию `WEBKASSA_TAX_TYPE=100`,
   `WEBKASSA_TAX_PERCENT=16` (таблица в 4.1 обновлена), `Tax = round2(Price * 16 / 116)`.
3. **Пополнение медсчёта — решено.** Фискализируется чеком продажи (`OperationType 2`), как
   остальные назначения; `MED_ACCOUNT_TOPUP` остаётся в `WEBKASSA_FISCALIZE_PURPOSES`.
   `BALANCE_TOPUP` — по умолчанию (не фискализируется).
4. **Двойная фискализация — решено.** FreedomPay выдаёт свои чеки; в интеграции с FreedomPay
   ничего не меняем. Фискализация через Webkassa делается независимо от этого, как описано выше.
5. **Чеки возврата — по умолчанию.** Возвраты через `AppointmentRefund` пробиваются
   автоматически; при поздней отмене — возврат на фактически возвращённую сумму (70%), чек
   продажи на 100% не меняется. Возвраты, проведённые руками в кабинете FreedomPay в обход
   `AppointmentRefund`, пробиваются вручную в кабинете Webkassa (вне объёма).
6. **Данные покупателя — по умолчанию.** `CustomerPhone` передаётся
   (`WEBKASSA_SEND_CUSTOMER_PHONE=true`), `CustomerEmail` — если есть у пользователя,
   `CustomerXin` — ИИН пациента (решение пользователя от 09.10.2026). На SMS от Webkassa не полагаемся.
7. **Касса и смены — по умолчанию.** Касса считается выделенной под приложение; Z-отчёт
   ежедневно в 23:55 Asia/Almaty (`WEBKASSA_SHIFT_CLOSE_CRON`). Если касса окажется общей с
   регистратурой, расписание снимается пустым `WEBKASSA_SHIFT_CLOSE_CRON`.
8. **Тип оплаты — по умолчанию.** Всегда `1` (банковская карта), `WEBKASSA_PAYMENT_TYPE`.
9. **Названия позиций — по умолчанию.** Как в таблице 4.5; `PositionCode` — как там же;
   `SectionCode` и названия на казахском не передаются.
10. **Боевая среда — открыто, вне этой задачи.** URL, ЗНК, ключ и учётка боевой Webkassa будут
    выданы отдельно; до тех пор по умолчанию `WEBKASSA_API_URL=https://devkkm.webkassa.kz`,
    срок жизни токена — допущение 10 ч (`WEBKASSA_TOKEN_TTL_MINUTES=600`).
11. **Ссылка пациенту — по умолчанию.** `TicketUrl` (страница ОФД).
12. **Бэкфилл — по умолчанию.** Нет: строки чеков появляются только у платежей, оплаченных
    после выкатки.
13. **Удаление данных — по умолчанию.** `onDelete: Restrict` на `FiscalReceipt` → `User`,
    `Payment`, `AppointmentRefund`. Жёсткого удаления `User`/`Payment` в коде нет (админ удаляет
    только `Patient`), поэтому ничего не ломается.
14. **Дашборд — по умолчанию.** UI очереди чеков — отдельной задачей в `archimedes-dashboard`;
    здесь только API (4.8).
