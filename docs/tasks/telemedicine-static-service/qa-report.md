# QA report: telemedicine-static-service

Дата: 2026-10-10. VERDICT: PASS (с оговорками про ручную проверку, см. конец).

Проверялись только изменения по задаче; чужие незакоммиченные правки (receipt-link, booking-history, topup-history, Podfile) не оценивались.

## Прогон команд

| Команда | Результат |
|---|---|
| backend `npm run build` | exit 0 |
| backend `npm test` (node:test + ts-node) | 6/6 pass |
| app `npx jest` | 11 suites pass, 1 fail (`__tests__/App.test.tsx` — Jest не парсит ESM `react-native-gesture-handler`, не связано с задачей, падал и до изменений); 65 тестов pass (63 разработчика + 2 мои) |
| app `npx eslint` по `src/modules/appointment`, `use-medic-service.ts`, `src/api/appointment-api.ts`, `src/api/index.ts` | 5 errors / 4 warnings, все существовавшие. Для `create-appointment-context.tsx` я сравнил с `HEAD` через `git show \| eslint --stdin`: те же 4 errors и 1 warning, сдвинуты по строкам. `choose-branch.tsx` (`useEffect` unused) не менялся |
| app `npx tsc --noEmit` | только 3 ошибки в `src/api/generated/Payment.ts` (существовавшие) |
| мой новый тест `use-specializations.test.tsx`: eslint и 3 прогона jest подряд | чисто, 2/2 pass, jest завершается сам |

## AC

| AC | Статус | Доказательство |
|---|---|---|
| AC-1 | PASS | `mis.service.ts:247-251` `booked_service: isTelemedicine ? config.telemedicine.serviceCode : medicServiceOid`; `medicServiceOid` игнорируется, а не отвергается (валидатор `mis.controller.ts:214` оставлен `optional`) |
| AC-2 | PASS | `appointment.payment-handler.ts:~190-201` `bookPaidAppointment` идёт в тот же `misService.createAppointment` с `isTelemedicine: metadata.isTelemedicine`; `validateMetadata` не менялся (`raw.isTelemedicine === true`) |
| AC-3 | PASS | при `isTelemedicine` false/undefined берётся `newAppointment.medicServiceOid`, как раньше |
| AC-4 | PASS (чтением кода) | `payment.service.ts:174` `runBeforePayment` стоит до `payment.create` и до вызова FreedomPay; `ensurePayable` = `ensureTelemedicinePrice` и затем `ensureBookable`; `amount !== config.telemedicine.price` даёт `AppError(MISMATCH, 409)` + `warn`. Сообщение — человекочитаемая русская константа в `appointments.service.ts`. Рантайм-теста нет, см. замечания |
| AC-5 | PASS | `ensureTelemedicinePrice` сразу возвращается при `!metadata.isTelemedicine` |
| AC-6 | PASS (чтением) | `appointments.routes.ts:318` `router.get('/telemedicine', authenticate, asyncHandler(...))`; первый маршрут с `/:id` — строка 624. Между ними идут только статичные пути (`/history`, `/admin` и т.п. ниже 318 с другими префиксами), так что перехвата нет. Форма ответа `{ success, telemedicine: { price, serviceName } }` совпадает со спекой. Без токена 401 даёт `authenticate` |
| AC-7 | PASS | `config/index.ts:222-235` читает все три значения из env, `price` — через `numberFromEnv` (устойчив к пустой строке и NaN), `.env.example` дополнен. Код, цена и фильтр используют только `config.telemedicine.*` |
| AC-8 | PASS | `mis.specializations.ts` — подстроки и имя приводятся к upper case. Прогон по 48 названиям (шесть из OQ-2 плюс 41 обычная специальность): оставлены все 41 остальные, в том числе «Нейрохирург», «Физиотерапевт», «Терапевт», «Мануальный терапевт», «Музыкотерапевт». Отсечены ровно «Врач УЗИ», «Врач УЗИ (ЭХО КГ)», «Массажист», «Стоматолог», «Выездная служба», «Психолог», «Рентгенолог». Юнит-тест `mis.specializations.test.ts` проходит |
| AC-9 | PASS | `getSpecializationsByBranchId(branchId, isTelemedicine = false)` без флага возвращает `response.specialties` без изменений; контроллер передаёт `isTelemedicine === 'true'` |
| AC-10 | PASS | `git status` по `src/domains/fiscal` пуст; `TELEMEDICINE_SERVICE_NAME = POSITION_NAMES.telemedicine` — константа направлена в обратную сторону, файл чека не тронут |
| AC-11 | PASS | `use-specializations.ts`: белый список «Терапевт» удалён, при телемедицине уходит `isTelemedicine=true`, остаются общие исключения УЗИ / ВЫЕЗДНАЯ СЛУЖБА / МАССАЖ. Тест `use-specializations.test.tsx` (мой) |
| AC-12 | PASS | в очном режиме запрос `?branchId=` без флага (проверено тестом `toHaveBeenCalledWith({ branchId })`), клиентский фильтр тот же |
| AC-13 | PASS | `create-appointment-form.tsx:70-74` сбрасывает `specializationId`, `doctorId`, `timeSlot`; `isBookingEnabled` требует все три |
| AC-14 | PASS | `visitPriceOf` отдаёт `{ price: offer.price, discountedPrice: null, serviceName }` (юнит-тест). `useMedicService(..., !isTelemedicine)` и `useServicePrice(..., !isTelemedicine && ...)` выключены; `medicService` для телемедицины принудительно `null`, даже из кэша. `AppointmentPrice` берёт название из `visitPrice.serviceName` |
| AC-15 | PASS | `initAppointmentPaymentMutation`: `amount = discountedPrice ?? price` (6000), `description` и `metadata.serviceName` = `visitPrice.serviceName`, `medicServiceOid` только при `!isTelemedicine` |
| AC-16 | PASS | `isBookingEnabled` содержит `(!isPaidVisit \|\| !!visitPrice)`, а `visitPrice` = null без оффера. Тост по `isError` при `isPaidTelemedicine` (context ~203-210), ключ i18n есть в ru/kk/en |
| AC-17 | PASS | `isPaidTelemedicine = isTelemedicine && isPaidVisit`; при программе `isMedAccount` оффер не включён, `visitPriceOf` даёт null (тест «med-account visit shows no price» с подставленными offer/medicService/servicePrice). Оплата не запускается (`bookAppointment` идёт в `createAppointmentMutation` при `!isPaidVisit`). `isPaidVisit` включает `!loadingPrograms`, то есть и пока программы грузятся оффер не запрашивается |
| AC-18 | PASS | то же для прочих программ (юнит-тест) |
| AC-19 | PASS (чтением) | существующий `onError` платного флоу показывает `response.data.message`, `onSuccess` с навигацией не вызывается |
| AC-20 | PASS | ветка очного приёма в `visitPriceOf` повторяет прежнюю логику (6 юнит-тестов), `medicServiceOid` отправляется в обоих флоу |
| AC-21 | PASS с оговоркой | юнит-тесты `visitPriceOf` (10) и фильтра бэкенда (6) есть; добавлен тест хука спецификаций. Новых lint-ошибок нет (сравнение с `HEAD`), но `npm run lint` целиком не выполнялся — см. оценку отклонений |
| AC-22 | PASS | CLAUDE.md обоих репозиториев содержат разделы про телемедицину (backend: «Telemedicine» + правка «Med-account visit price»; app: абзацы в «Med-account visit price») |

## Оценка отклонений, названных разработчиком

1. **`npm run lint` не завершается.** Приемлемо. Причина в `eslint .` по `ios/Pods`, а не в задаче. Я воспроизвёл проверку точечно: изменённые файлы дают тот же набор ошибок, что и `HEAD`. Рекомендация вне задачи: `ignorePatterns` для `ios/`, `android/`, `node_modules`.
2. **`App.test.tsx` падал и до изменений.** Приемлемо. Причина — ESM-зависимость `react-native-gesture-handler` (SyntaxError в `NativeRNGestureHandlerModule.ts`), задача её не затрагивает.
3. **3 ошибки tsc в `generated/Payment.ts`.** Приемлемо, существовали до изменений, в изменённых файлах ошибок нет.
4. **Бэкенд `test` заменён на `node:test` через ts-node.** Приемлемо: новых зависимостей нет, `*.test.ts` исключён из `tsc` и в `dist` не попадает. Скрипт `test` раньше намеренно падал, а AC-21 требует зелёный `npm test` и тест фильтра. Отмечу, что в `tsconfig` тесты исключены, поэтому `ts-node` запускается с `transpile-only` — типы теста отдельно проверялись разработчиком через `tsc --noEmit`.
5. **`isTelemedicine` через рукописный `appointmentApi.specializationsList`.** Приемлемо: `src/api/generated/` не правится руками (требование CLAUDE.md), бэкенд для регенерации недоступен; в обычном режиме запрос байт-в-байт прежний. Нужно удалить метод после `npm run generate-api` — это зафиксировано в JSDoc и CLAUDE.md.
6. **`isIn(['true','false'])` вместо `isBoolean`.** Приемлемо и даже точнее: `isBoolean` пропускал бы `1`/`0`, которые потом не читались бы как `true`. Расхождения со спекой по поведению нет.

## Замечания (не блокируют)

- **Нет автотеста на серверную проверку цены (AC-4) и на порядок маршрутов (AC-6).** В бэкенде нет тестового каркаса для БД и express; проверено только чтением кода. Это пробел покрытия, а не дефект.
- **Тост ошибки оффера** висит на `useEffect` с зависимостями `[showToast, t]`. Если `useToast` возвращает нестабильную функцию, тост может повторяться при ререндерах. Не проверялось на устройстве, дефектом не подтверждено.
- **Запись `Payment` и FreedomPay для старых сборок.** У старой сборки цена телемедицины будет ≠ 6000 (цена очного приёма), она получит 409 с русским сообщением — это принятое решение OQ-7.
- **Серверного ограничения по специальности нет** — по OQ-9 так и задумано.
- Подстрока `УЗИ` теоретически совпадёт с любым словом, содержащим «узи» (например, фамилия), но в списке специальностей МИС таких нет (OQ-2).

## Баги

Не найдено.

## Что остаётся на ручную проверку

1. Выкатка: **сначала бэкенд**, затем сборка приложения. Новая сборка против старого бэкенда видит все специальности и получает 404 на `/appointments/telemedicine`.
2. На стенде: `GET /appointments/telemedicine` с токеном (200) и без токена (401); убедиться, что он не уходит в `/:id`.
3. `POST /payment/init` для `APPOINTMENT` с `isTelemedicine: true` на 6000 (проходит) и на другую сумму (409, нет строки `Payment`, нет вызова FreedomPay).
4. Реальный `POST /mis/create-appointment` в МИС: принимает `booked_service = A02.083.000` (OQ-3), для обоих путей (по программе и после оплаты).
5. `GET /mis/specializations?isTelemedicine=true` по реальным ответам МИС всех 14 филиалов.
6. На устройстве: переключение «Обычный» и «Телемедицина» сбрасывает специальность, врача и слот; карточка цены на 6 000 ₸ без зачёркнутой цены только у платного приёма; у `isMedAccount` и у прочих программ карточки нет, а в сетевой отладке нет запросов к `/appointments/telemedicine`, `/insurance/medic-service`, `/insurance/service-price`; тост при падении `/appointments/telemedicine` и неактивная кнопка.
7. Чек (Webkassa) за телемед-приём: одна позиция на сумму платежа, без кода (новая сборка не шлёт `medicServiceOid`).

Добавленный мной файл: `/Users/askhatbaltabayev/Documents/projects/archimedes-app/src/modules/appointment/hooks/__tests__/use-specializations.test.tsx`
