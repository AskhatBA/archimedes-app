# Dev notes — webkassa-fiscalization

Дата: 2026-10-07. Ничего не закоммичено.

## Решения по открытым вопросам

Раздел 8 spec.md переписан в «Открытые вопросы → решения»: 1–4 — ответы заказчика (учётка
тестовой кассы, НДС 16% на всё, медсчёт фискализируется, FreedomPay не трогаем), 5–14 —
значения по умолчанию из спецификации. Таблица конфигурации в 4.1 обновлена
(`WEBKASSA_TAX_TYPE=100`, `WEBKASSA_TAX_PERCENT=16`). Секреты в spec — только как имена
переменных.

## Изменённые файлы

### Backend (`../archimedes-backend`)

Новые:
- `src/domains/fiscal/webkassa.types.ts` — типы API 2.0.4, коды ошибок, константы позиций.
- `src/domains/fiscal/webkassa.client.ts` — axios-клиент (`x-api-key`, таймаут 20 с), токен в
  Redis `webkassa:token`, `withToken` с одной переавторизацией на 2/3, разбор `Errors[]` в
  `WebkassaError { code, text, retryable, data }`, перебор `AlternativeDomainNames` на 505,
  `createCheck`, `closeShift`, `getTicketByExternalCheckNumber` (`/api/v4/Ticket/PrintFormat`).
- `src/domains/fiscal/fiscal.positions.ts` — состав чека по назначению, НДС, снимок.
- `src/domains/fiscal/fiscal.service.ts` — `createSaleReceiptInTx`, `createReturnReceipt`,
  `issueReceipt`, `closeShift`, `runScheduledShiftClose`, `sweepPendingReceipts`,
  `getWebkassaBlocker`.
- `src/domains/fiscal/fiscal.admin.service.ts`, `fiscal.controller.ts`, `fiscal.routes.ts`,
  `fiscal.dto.ts` — API дашборда.
- `src/shared/queues/webkassa.queue.ts`, `webkassa.worker.ts` — очередь `webkassa`.
- `src/infrastructure/db/migrations/20261008120000_webkassa_fiscal_receipts/migration.sql`.

Изменённые:
- `src/infrastructure/db/schema.prisma` — `FiscalReceipt`, enum'ы, обратные связи, 4 значения
  `AuditEvent`.
- `src/config/index.ts` — блок `config.webkassa`.
- `.env.example` (в git не отслеживается) — блок Webkassa с пустыми секретами. Локальный `.env`
  (gitignored) — тестовые креды devkkm, `WEBKASSA_ENABLED=true`, `TAX_TYPE=100`, `TAX_PERCENT=16`.
- `src/domains/payment/payment.service.ts` — `settlePayment`: строка чека в транзакции,
  постановка в очередь после коммита без ожидания.
- `src/domains/appointments/appointment-refund.service.ts` — чек возврата в
  `processAppointmentRefund` (accepted) и `updateRefund` (COMPLETED).
- `src/domains/appointments/appointments.history.service.ts`, `appointments.dto.ts`,
  `appointments.routes.ts` — `receiptUrl`, `refund.receiptUrl`.
- `src/domains/med-account/med-account.service.ts`, `med-account.dto.ts`,
  `med-account.routes.ts` — `receiptUrl` в `GET /med-account/topups`
  (`MedAccountTopupHistoryDto`).
- `src/domains/program-orders/program-orders.service.ts`, `program-orders.dto.ts`,
  `program-orders.routes.ts` — `receiptUrl` в заказах (пользовательские и admin-чтения).
- `src/shared/lib/logger/redact.ts` — `Token`, `Password`, `Login`, `x-api-key`, `Customer*`
  (+ скобочная нотация для имён с дефисом).
- `src/shared/constants/error-codes.ts` — 4 кода.
- `src/routes.ts` (`/v1/api/fiscal`), `src/server.ts` (старт/стоп воркера).
- `CLAUDE.md` — раздел «Fiscal receipts (Webkassa)».

### App

- `src/api/appointment-api.ts` — `receiptUrl` у `AppointmentHistoryItem` и у `refund`.
- `src/modules/med-account/types.ts` — `Topup.receiptUrl`.
- `src/modules/med-account/hooks/use-topup-history.ts` — маппинг `receiptUrl` (см. отклонения).
- `src/shared/components/receipt-link/` (новый) — `ReceiptLink`: ссылка, `Linking.openURL`,
  тост при отказе.
- `booking-history-card.tsx`, `topup-history-card.tsx` — ссылки «Чек об оплате» / «Чек возврата».
- `src/shared/lib/i18n/locales/{ru,kk,en}.json` — `common.receipt.{sale,return,openFailed}`.
- Тесты: `booking-history-card.test.tsx`, `topup-history-card.test.tsx`.
- `CLAUDE.md` — раздел «Fiscal receipts».

## Отклонения от спецификации и находки

1. **Тестовая организация devkkm не плательщик НДС.** Webkassa отвечает кодом 9 «ставка НДС
   16% недоступна для организации» (12/10/5 тоже), а Z-отчёт возвращает
   `TaxPayerVAT: false`. С решением 8.2 (TaxType 100 / 16%) каждый чек на тестовой кассе
   сразу уходит в `FAILED`. Код и `.env` оставлены по решению (100/16); смоук гонялся с
   переопределением `WEBKASSA_TAX_TYPE=0` в окружении процесса. Нужно: либо включить НДС у
   тестовой организации в devkkm, либо локально ставить `WEBKASSA_TAX_TYPE=0`. На бою
   регистрация организации как плательщика НДС в Webkassa должна совпадать с решением 8.2.
2. **Колонка `retryRound`** (не была в схеме spec): `jobId` по spec содержит `retryRound`, и
   проход-сверка должен строить тот же `jobId`, что и исходная задача, — без хранимого значения
   это невозможно.
3. **Ключи i18n** лежат в неймспейсе `common` (`common:receipt.*`): spec не указал неймспейс,
   а ссылка нужна двум модулям.
4. **`use-topup-history.ts`** spec не упоминал: хук маппит ответ сгенерированного клиента, у
   которого `receiptUrl` нет. `src/api/generated` не правился; поле читается узким кастом с
   комментарием — `npm run generate-api` против нового бэкенда сделает его лишним.
5. Последняя попытка задачи переводит чек в `FAILED` прямо в `issueReceipt`
   (`isLastAttempt`), а `worker.on('failed')` — страховка для неожиданных сбоев.
6. Постановка в очередь после `settlePayment` не ожидается (`void`): иначе колбэк FreedomPay
   повис бы при недоступном Redis (ioredis с `maxRetriesPerRequest: null`).
7. `receiptUrl` в заказах программ добавлен и в admin-чтения (spec: «для дашборда»).

## Как реализован каждый AC и как проверен

Смоук-скрипт (вне репозитория) против локальных Postgres/Redis и devkkm, касса SWK00035676:
вызывает настоящий `handleCallback` с подписью FreedomPay, запускает настоящий воркер,
обработчики назначений не регистрировались (никаких МИС/страховой/почты). Тестовые данные
удалены после прогона. 26/27 проверок PASS; одна «FAIL» — ошибка ожидания в самом тесте
(поиск по `paymentId` справедливо нашёл и продажу, и возврат).

| AC | Реализация | Проверка |
|---|---|---|
| 1 | `createSaleReceiptInTx` в транзакции `settlePayment` | PASS: 1 строка SALE, `externalCheckNumber=payment.id` |
| 2 | создаёт только победитель `updateMany`; unique `externalCheckNumber` | PASS: 2 параллельных колбэка + повтор → 1 строка |
| 3 | `isFiscalizedPurpose`, только при SUCCESS | PASS: BALANCE_TOPUP и FAILED без строк |
| 4 | одна вставка в tx, постановка без ожидания | PASS: ответ `ok`, 31 мс на гонку |
| 5 | чек не зависит от обработчика назначения | по коду: создаётся до `runPostPaymentSuccess`; в смоуке обработчики не запускались, чеки выпущены |
| 6 | `markIssued` сохраняет все реквизиты | PASS: ISSUED, все поля заполнены, чек виден на devkkm |
| 7 | `toWebkassaPosition`, `buildReceiptContent` | PASS: PositionType 2, UnitCode 5114, сумма = Payments = amount |
| 8 | по позиции на `metadata.items` | PASS: 3 позиции с названиями/ценами корзины |
| 9 | код 14 + `Data` → ISSUED | PASS: повтор с тем же номером → тот же `checkNumber` |
| 10 | `getWebkassaBlocker` + `sweepPendingReceipts` | PASS: выкл → PENDING, attempts 0; вкл + сверка → ISSUED |
| 11 | сеть → `retryOrFail`, backoff 30 с exp, последняя попытка → FAILED | PASS: PENDING + `lastError`, затем FAILED |
| 12 | `NON_RETRYABLE_CODES`, валидационный 9 | PASS живьём: код 9 (НДС 16%) → FAILED, attempts 1, audit; заглушками: 1/7/10 → FAILED |
| 13 | `withToken`: сброс кэша, переавторизация, один повтор | PASS: битый токен в Redis → ISSUED с 1 попытки |
| 14 | 11 → `closeShift` → один повтор | PASS на заглушках (смену > 24 ч не создать по запросу) |
| 15 | `upsertJobScheduler` cron+tz; 12/13 не ошибка | PASS: расписание `55 23 * * *` Asia/Almaty в Redis; Z-отчёт закрыл смену, повтор → `closed:false` (код 12) |
| 16 | одна очередь, `concurrency 1` + `setGlobalConcurrency(1)` | PASS: 10 одновременных оплат → 10 ISSUED, по 1 попытке, ошибок 9 нет |
| 17 | `createReturnReceipt` + `ReturnBasisDetails` | PASS: 1 SALE_RETURN, `externalCheckNumber=refund.id`, основание = чек продажи |
| 18 | `Price = refund.amount` | PASS: продажа 1500.5, возврат 1050.35 (70%) |
| 19 | `amount > 0`, только COMPLETED | PASS: нулевой возврат → без чека; PENDING/FAILED и `pending` FreedomPay не вызывают создание (по коду) |
| 20 | unique `refundId` | PASS: повторный COMPLETED → одна строка |
| 21 | продажа PENDING → повтор; нет/FAILED → `lastError`, затем FAILED | PASS |
| 22 | `/fiscal/admin/receipts` с `requireRole(ADMIN)` | PASS по HTTP: пациент 403, админ 200 с `totalAmount`, карточка с `positions`, 404 |
| 23 | `retryReceipt` только из FAILED | PASS: FAILED → PENDING → ISSUED; повтор ISSUED → 409 `FISCAL_RECEIPT_NOT_RETRYABLE` |
| 24 | `include` в тех же запросах | PASS: история (`receiptUrl`, `refund.receiptUrl`), пополнения (FAILED-чек → `null`), заказы |
| 25 | redact + клиент не логирует тела | PASS: прогон с `LOG_LEVEL=debug`, в логе 0 вхождений API-ключа, пароля, логина, токена, телефона; секретов нет ни в одном файле обоих репо, кроме `backend/.env` |
| 26 | blocker при `FREEDOMPAY_TESTING_MODE` и не-devkkm URL | PASS: PENDING, attempts 0, `error` в логе |
| 27 | `ReceiptLink` в `BookingHistoryCard` | jest: ссылка есть/нет, `openURL(receiptUrl)` |
| 28 | `refund.receiptUrl` → «Чек возврата» | jest: обе ссылки, нажатие открывает URL возврата |
| 29 | `ReceiptLink` в `TopupHistoryCard` | jest: есть/нет |
| 30 | тост при отказе `openURL` | jest: `showToast({type:'error', message:'Не удалось открыть чек'})` |
| 31 | — | см. ниже |

## Команды и результаты

Backend:
- `npm run build` — OK.
- `eslint` по изменённым/новым файлам — OK (0 проблем). `server.ts` линтер не берёт: правило
  `security-node/detect-improper-exception-handling` падает на уже существующих
  `process.on(...)`.
- `prisma migrate deploy` на локальной БД (docker, :5433) — применена;
  `prisma migrate diff` БД ↔ схема — расхождений нет.
- Тестов в бэкенде нет (`npm test` не настроен).

App:
- `npx jest` — 53/53 тестов PASS, 9/10 наборов; `__tests__/App.test.tsx` падает так же и без
  изменений (jest не транспилирует `@gorhom/bottom-sheet`).
- `npx eslint src __tests__` — 43 проблемы, все в файлах, которые не менялись (на базовой
  версии тот же набор); изменённые файлы чистые. `npm run lint` (`eslint .`) не завершился за
  10+ минут и был остановлен.
- `npx tsc --noEmit` — только существующие ошибки в `src/api/generated/Payment.ts`.

Смоук против devkkm: Authorize — OK; продажа, дубль (код 14 с данными), частичный возврат
с `ReturnBasisDetails`, Z-отчёт (и 12 на повторе) — OK. На тестовой кассе остались около 20
тестовых чеков и закрытые смены 1–2. В локальном Redis остались кэшированный токен кассира
(`webkassa:token`, TTL 10 ч) и расписания очереди `webkassa`.

## Не сделано

- UI дашборда (решение 8.14).
- Боевые URL/ЗНК/ключ (решение 8.10).
- `npm run generate-api` не запускался (нужен запущенный бэкенд).
- Казахские строки должен проверить носитель языка.
