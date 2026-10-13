# QA-отчёт — webkassa-fiscalization

Дата: 2026-10-07. Проверялись незакоммиченные изменения в app и backend. Код не менялся.
Живые вызовы в Webkassa (новые чеки) QA не делал: AC, требующие стенда, приняты по
смоук-протоколу из dev-notes и перечислены в разделе «Ручная проверка».

## 1. Команды и результаты

| Проверка | Результат |
|---|---|
| backend `npm run build` (tsc + tsc-alias) | OK, rc=0 |
| backend `prisma validate` | schema valid |
| backend `prisma migrate status` (локальная БД :5433) | 41 миграция, схема актуальна |
| backend `prisma migrate diff` БД <-> schema.prisma | "No difference detected" (миграция == схема) |
| backend eslint по изменённым/новым файлам (`ESLINT_USE_FLAT_CONFIG=false`, конфиг `.eslintrc.json`) | 6 ошибок, все в файлах/строках, не относящихся к задаче: `med-account.payment-handler.ts`, `program-order.email.ts` (не менялись), `med-account.routes.ts:1`, `program-orders.routes.ts:1`, `program-orders.service.ts:129` (на `HEAD` те же ошибки import/order и prettier). Файлы `src/domains/fiscal/**`, очереди, `payment.service.ts`, `appointment-refund.service.ts`, `redact.ts` — чисто |
| backend eslint `src/server.ts` | падает (security-node) — подтверждено, что и на `HEAD` падает так же: pre-existing |
| app `npx jest` | 9/10 наборов, 53/53 тестов PASS. FAIL только `__tests__/App.test.tsx` (`@gorhom/bottom-sheet`, "Cannot use import statement outside a module") — pre-existing, к изменениям не относится |
| app `npx jest` по `booking-history` и `med-account` | 2 набора, 17 тестов PASS |
| app `npx tsc --noEmit` | 3 ошибки, все в `src/api/generated/Payment.ts` (pre-existing); других нет |
| app eslint по изменённым файлам (`appointment-api.ts`, booking-history, med-account, receipt-link) | 0 проблем |
| app `npx eslint src __tests__` | 33 ошибки + 10 предупреждений в 21 файле; ни один из них не менялся в этой задаче (нет в `git status`) — pre-existing. `npm run lint` (`eslint .`) целиком не прогонялся (по dev-notes не завершается за 10+ минут) |
| Проверка redact (pino + `redactPaths` из `dist`) | `Token`, `Password`, `Login`, `CustomerPhone/Email/Xin`, `x-api-key` — на верхнем уровне, во вложенных `headers`, `body`, `responseData.Data`, `payload.*` — заменяются на `[Redacted]`, утечек нет |
| Поиск значений `WEBKASSA_API_KEY`/`LOGIN`/`PASSWORD` из `.env` (значения не выводились) по всем файлам обоих репозиториев (tracked, untracked, ignored; без node_modules/.git/Pods) | Найдены только в `archimedes-backend/.env` (gitignored, `.gitignore:61`). В spec, dev-notes, CLAUDE.md, тестах, `.env.example` нет. В `.env.example` у трёх секретов пустые значения |

## 2. Критерии приёмки

Обозначения: "код" — проверено чтением кода QA; "смоук" — результат dev-смоука против devkkm, перечитанный в dev-notes и сверённый с кодом, QA его не перезапускал.

| AC | Статус | Доказательство |
|---|---|---|
| 1 | PASS | `payment.service.ts` (`settlePayment`): `createSaleReceiptInTx(tx, payment)` внутри `$transaction`, после `updateMany` с `count > 0` и `status === SUCCESS`. `fiscal.service.ts` `createSaleReceiptInTx`: `externalCheckNumber = payment.id`, `amount = toMoney(payment.amount)`, `SALE`. Смоук: 1 строка |
| 2 | PASS | Строку создаёт только победитель условного `updateMany` (код); `externalCheckNumber @unique` (schema.prisma, миграция `FiscalReceipt_externalCheckNumber_key`). Смоук: 2 параллельных колбэка + повтор -> 1 строка |
| 3 | PASS | `createSaleReceiptInTx` вызывается только в ветке `SUCCESS`; `isFiscalizedPurpose` (config по умолчанию без `BALANCE_TOPUP`). Смоук подтверждает |
| 4 | PASS | В транзакции одна вставка; постановка в очередь `void enqueueReceiptSafely(...)` после коммита, без `await` (`payment.service.ts`), поэтому колбэк не ждёт ни Redis, ни Webkassa. Тело ответа колбэка не менялось (diff `payment.service.ts` только про settle) |
| 5 | PASS | Чек создаётся в `settlePayment` до `runPostPaymentSuccess`, от результата обработчика не зависит (код). Живого прогона с упавшим обработчиком не было — см. ручную проверку |
| 6 | PASS (смоук) | `markIssued` пишет `checkNumber`, `registrationNumber`, `checkOrderNumber`, `shiftNumber`, `offlineMode`, `fiscalizedAt`, `ticketUrl`, `ticketPrintUrl`. Смоук: ISSUED со всеми полями. Не пересмотрено QA; чек в кабинете devkkm — на ручную проверку |
| 7 | PASS | `fiscal.positions.ts`: `PositionType = 2`, `UnitCode = 5114`, `Payments[0].Sum` = сумма `Price*Count`; `issueReceipt` сверяет сумму с `receipt.amount` (допуск 0,005), иначе `FAILED` |
| 8 | PASS | `paidProgramPositions`: по позиции на `metadata.items` (`title`, `code`, `price`); сводная позиция + `warn`, если сумма не сходится или позиций нет. Форма `items` совпадает с документацией init (`payment.routes.ts`) |
| 9 | PASS (смоук) | `handleWebkassaError`: код 14 с `Data.CheckNumber` -> `markIssued(..., viaDuplicate=true)`; без `Data` -> `FAILED` с текстом из спецификации. `WebkassaError.data` сохраняется клиентом. Смоук: повтор вернул тот же `checkNumber` |
| 10 | PASS | `issueReceipt` и `sweepPendingReceipts` при `WEBKASSA_ENABLED=false` ничего не отправляют, строки остаются `PENDING`, `attempts` не растёт; завершённые задачи удаляются (`removeOnComplete: true`), поэтому sweep может поставить тот же `jobId` заново после включения флага. Смоук подтверждает |
| 11 | PASS | Сеть/5xx/-1/505/18/«последовательный» 9 -> `retryOrFail` (`lastError`, `lastErrorCode`, `FiscalRetryableError`); BullMQ `attempts = WEBKASSA_MAX_ATTEMPTS`, `backoff exponential 30 s`; на последней попытке `markFailed` |
| 12 | PASS | `NON_RETRYABLE_CODES` = 1,4,5,6,7,10; валидационный 9 не ретраится (`isRetryableCode`); `markFailed` -> `error`-лог + Sentry + аудит `FISCAL_RECEIPT_FAILED`. Смоук: живой код 9 -> `FAILED`, attempts 1 |
| 13 | PASS (смоук) | `withToken`: на 2/3 сброс кэша `webkassa:token`, `authorize()`, один повтор |
| 14 | PASS (заглушки) | `issueReceipt`: код 11 -> `closeShiftForRetry` -> один повтор `send()`. Живьём смену > 24 ч не создать |
| 15 | PASS | `upsertJobScheduler` с `pattern = WEBKASSA_SHIFT_CLOSE_CRON`, `tz: 'Asia/Almaty'`; пустой cron снимает расписание; `closeShift`: 12/13 -> `{closed:false}` без `error` в логе |
| 16 | PASS | Одна очередь, `concurrency: 1` + `setGlobalConcurrency(1)` (`webkassa.queue.ts`, `webkassa.worker.ts`). Смоук: 10 одновременных оплат -> 10 ISSUED, ошибок 9 нет |
| 17 | PASS | `createReturnReceipt`: `refundId`, `externalCheckNumber = refund.id`, `amount = refund.amount`; вызывается в `processAppointmentRefund` ветка `accepted` после `settle`; `buildReturnCheck` собирает `ReturnBasisDetails` из чека продажи |
| 18 | PASS | Цена позиции возврата = `receipt.amount` (сумма возврата), чек продажи не трогается. Смоук: 1500.5 / 1050.35 |
| 19 | PASS | `createReturnReceipt` ничего не делает при `amount <= 0`; ветка `amount <= 0` в `processAppointmentRefund` вызывает только `settle`; для `pending`/`FAILED` исходов `createReturnReceipt` не вызывается; `updateRefund` вызывает его только при `status === COMPLETED` |
| 20 | PASS | `updateRefund` -> `createReturnReceipt` при COMPLETED; повтор ловит P2002 (`refundId @unique`) и возвращает `null`. Смоук подтверждает |
| 21 | PASS | `issueReceipt`: продажа `PENDING` -> `retryOrFail(salePending)`; нет/`FAILED` -> `retryOrFail(saleMissing)`; после лимита -> `FAILED` |
| 22 | PASS | `fiscal.routes.ts`: все 4 маршрута `authenticate + requireRole(ADMIN)`; список с пагинацией, фильтрами, `search`, `totalAmount` (`fiscal.admin.service.ts`). Смоук по HTTP: пациент 403, админ 200 |
| 23 | PASS | `retryReceipt`: условный `updateMany where status=FAILED`, иначе 409 `FISCAL_RECEIPT_NOT_RETRYABLE`; `retryRound` +1 даёт новый `jobId`. Смоук: FAILED -> PENDING -> ISSUED; ISSUED -> 409 |
| 24 | PASS | `include` в `appointments.history.service.ts`, `med-account.service.ts`, `program-orders.service.ts`: только `SALE/ISSUED` (и `refund.fiscalReceipt.status === ISSUED`), иначе `null`; без N+1. `refund.receiptUrl` реализован. Для приёмов, привязанных к платежу по метаданным (до запуска), `receiptUrl = null` — осознанно |
| 25 | PASS | Секретов вне `backend/.env` нет (см. раздел 1); `redact.ts` покрывает PascalCase и `x-api-key` (проверено прогоном); клиент не логирует тела запросов/ответов и подменяет axios-ошибку (в ней тело запроса); в `positions` нет контактов покупателя; аудит-метаданные без телефона/email. Прогон оплаты с `LOG_LEVEL=debug` — по dev-notes, QA не повторял |
| 26 | PASS | `getWebkassaBlocker`: `FREEDOMPAY_TESTING_MODE=true` и хост не `devkkm.*` -> `misconfigured`, `error`-лог; чек остаётся `PENDING`. Смоук подтверждает |
| 27 | PASS | `booking-history-card.tsx`: `{!!booking.receiptUrl && <ReceiptLink url=... />}`; тест `fiscal receipts` — нет ссылки при `null`, `Linking.openURL(receiptUrl)` при наличии |
| 28 | PASS | `{!!booking.refund?.receiptUrl && <ReceiptLink ... kind="return" />}`; тест с обеими ссылками, нажатие открывает URL возврата |
| 29 | PASS | `topup-history-card.tsx` + `types.ts` + `use-topup-history.ts` (узкий каст, т.к. `src/api/generated` не правится); тест есть/нет |
| 30 | PASS | `receipt-link.tsx`: `Linking.openURL(url).catch(() => showToast({type:'error', message: t('common:receipt.openFailed')}))`; тест "says so when the receipt cannot be opened" |
| 31 | PASS с оговоркой | Тест карточки истории покрывает оба варианта. Изменённые файлы чисты по eslint; `jest` по задаче зелёный. Глобально `npm run lint` и `npm test` не зелёные из-за уже существовавших проблем (33 eslint-ошибки в 21 нетронутом файле, `App.test.tsx`) — к задаче не относятся |

Прочие требования: нет правок в `src/api/generated` (`git status` пуст); цвет ссылки берётся из `colors` (`colors.blue['400']`), без хардкода; route-строк нет; ключи `common:receipt.{sale,return,openFailed}` есть в ru/kk/en с текстами по спецификации; `onDelete: Restrict` на трёх связях в schema.prisma и миграции совпадает со спецификацией; миграция совпадает со схемой (diff пуст); раздел «Fiscal receipts» добавлен в оба `CLAUDE.md`.

## 3. Замечания (не блокируют)

1. **Низкая — `await` постановки в очередь в путях возврата.** В `processAppointmentRefund` и `updateRefund` стоит `await createReturnReceipt(refund)`, внутри `await webkassaQueue.add(...)`. Redis настроен с `maxRetriesPerRequest: null`, поэтому при недоступном Redis `add` зависнет, а не упадёт. Для `settlePayment` это учтено (`void`), для возврата нет. Влияние: `PATCH /appointments/admin/refunds/:id` (и запись аудита `APPOINTMENT_REFUND_PROCESSED` в воркере) может зависнуть до возврата Redis; статус возврата уже записан до вызова. Воспроизведение: остановить Redis, вызвать PATCH со статусом COMPLETED и `amount > 0`. Предложение: `void`/без ожидания, как в оплате (sweep всё равно подберёт).
2. **Низкая — невалидный UUID в `/fiscal/admin/receipts/:id` и `/:id/retry`.** Prisma кидает `P2023` (проверено на локальной БД), глобального маппинга нет -> 500 вместо 404/400. В соседних admin-доменах (med-account, program-orders) то же самое, поэтому по конвенции репозитория, но стоит добавить `param('id').isUUID()`, как в `appointments.controller.ts`.
3. **Низкая — вставка чека в транзакции settle.** Спецификация прямо требует писать строку в транзакции `settlePayment`; сбой вставки (недоступность БД, нарушение ограничения) откатит и переход платежа в SUCCESS, и зачисление баланса. Риск минимален (одна вставка, уникальность гарантирована логикой условного перехода), но это единственное место, где фискализация теоретически может повлиять на оплату. Принято как сознательное решение спецификации (4.4).
4. **Низкая — несвязанные изменения вне задачи и вне dev-notes.**
   - backend `docker-compose.yml`: добавлены healthcheck, `restart: always`, `migrate deploy` вместо `db:migrate`, удалён сервис `worker` (он вызывал `npm run worker`, такого скрипта в `package.json` нет); новый неотслеживаемый `docker-compose.dev.yml`.
   - app: `ios/Podfile` (патч fmt), `ios/Podfile.lock`, `package-lock.json` (316 строк), `src/shared/config/config.ts` (`DEV_IOS_API_URL` -> `http://localhost:4000/v1/api`).
   Не относятся к Webkassa; перед коммитом стоит вынести в отдельные коммиты или откатить. Изменение `docker-compose.yml` влияет на деплой.
5. **Информационно.** `.env.example` в backend не отслеживается git (это новый файл, не в `.gitignore`) — его нужно добавить в коммит, иначе блок Webkassa не попадёт в репозиторий. `use-topup-history.ts` читает `receiptUrl` узким кастом, пока не перегенерирован клиент (`npm run generate-api`). Казахские строки требуют проверки носителем.

Багов уровня FAIL не найдено.

## 4. Окружение и ручная проверка

Окружение (не дефект кода): тестовая организация devkkm не плательщик НДС (`TaxPayerVAT: false`), поэтому при `WEBKASSA_TAX_TYPE=100` / `16%` касса отвечает ошибкой 9, и чек корректно уходит в `FAILED` без повторов (поведение по AC-12). Для живого прогона нужно либо включить НДС у тестовой организации, либо локально `WEBKASSA_TAX_TYPE=0`. Боевая учётная запись Webkassa должна быть зарегистрирована как плательщик НДС (решение 8.2).

Остаётся проверить вручную:

1. AC-6: на devkkm чек действительно виден в кабинете по кассе SWK00035676 и `ticketUrl` открывается; при `TAX_TYPE=100` после включения НДС у организации.
2. AC-5: оплата, где обработчик назначения падает (`postSuccessError`), всё равно даёт ISSUED-чек (в смоуке обработчики не регистрировались).
3. AC-14: реальная ошибка 11 (смена > 24 ч) — проверено только заглушками.
4. AC-15: фактический запуск cron `55 23 * * *` в Asia/Almaty (в смоуке проверено наличие расписания и ручной Z-отчёт).
5. AC-25: повторный прогон оплаты с `LOG_LEVEL=debug` и поиск секретов/телефона/email/ИИН в логе (QA проверил redact-пути и код, но не живой лог).
6. AC-16 и AC-9 на стенде повторно после правок, если они появятся (в смоуке PASS).
7. Замечание 1 (зависание при остановленном Redis) — подтвердить воспроизведением.
8. Приложение на устройстве: открытие `receiptUrl` во внешнем браузере (iOS/Android), вёрстка карточек истории без чека не изменилась; казахские строки.
9. После выкатки: применение миграции `20261008120000_webkassa_fiscal_receipts` на целевой БД; `WEBKASSA_ENABLED` и секреты в боевом `.env`; очистка тестовых чеков/смен и кэша `webkassa:token` в локальном Redis.
10. `npm run lint` в app целиком (`eslint .`) — не завершился в окружении dev; QA проверил `src` и `__tests__` и изменённые файлы.

VERDICT: PASS
