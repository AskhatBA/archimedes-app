# Dev notes: telemedicine-static-service

Дата: 2026-10-10. Ничего не закоммичено. Чужие незакоммиченные правки в обоих репозиториях
(receipt-link, booking-history, topup-history, Podfile и т.д.) не трогались; в файлах, где они
уже были (`src/api/appointment-api.ts`, `src/shared/lib/i18n/locales/*.json`, app `CLAUDE.md`),
мои правки только добавлены рядом.

## Изменённые файлы

### Backend (`../archimedes-backend`)

| Файл | Что |
|---|---|
| `src/config/index.ts` | блок `telemedicine` (`serviceCode`, `price` через `numberFromEnv`, `excludedSpecialties`), хелпер `parseList` |
| `.env.example` | `TELEMEDICINE_SERVICE_CODE`, `TELEMEDICINE_PRICE`, `TELEMEDICINE_EXCLUDED_SPECIALTIES` |
| `src/domains/mis/mis.specializations.ts` (новый) | чистая `filterTelemedicineSpecializations(list, excluded)` |
| `src/domains/mis/mis.specializations.test.ts` (новый) | unit-тесты фильтра (`node:test`) |
| `src/domains/mis/mis.service.ts` | `getSpecializationsByBranchId(branchId, isTelemedicine)`; `booked_service` = код телемедицины при `isTelemedicine` |
| `src/domains/mis/mis.controller.ts` | query `isTelemedicine` (`isIn(['true','false'])`, необязательный) |
| `src/domains/mis/mis.dto.ts`, `mis.routes.ts` | JSDoc `medicServiceOid`, swagger параметра и поля |
| `src/domains/appointments/appointments.service.ts` | `APPOINTMENT_TELEMEDICINE_PRICE_MISMATCH_MESSAGE` рядом с `APPOINTMENT_SAME_DOCTOR_SAME_DAY_MESSAGE` |
| `src/domains/appointments/appointment-telemedicine.service.ts` (новый) | `TELEMEDICINE_SERVICE_NAME = POSITION_NAMES.telemedicine`, `getTelemedicineOffer()` |
| `src/domains/appointments/appointment.payment-handler.ts` | `ensureTelemedicinePrice` + `ensurePayable` (цена → конфликты) как `beforePayment` |
| `src/domains/appointments/appointments.controller.ts`, `.routes.ts`, `.dto.ts` | `GET /appointments/telemedicine` (до `/:id`), swagger, `TelemedicineOfferDto` |
| `package.json` | `npm test` → `node --test` + ts-node по `src/**/*.test.ts` (раньше скрипт падал намеренно) |
| `CLAUDE.md` | раздел «Telemedicine», правка «Med-account visit price», описание `npm test` |

Миграций нет. `fiscal.positions.ts` не изменён.

### App

| Файл | Что |
|---|---|
| `src/api/appointment-api.ts` | тип `TelemedicineOffer`; `telemedicineDetail()`; `specializationsList({ branchId, isTelemedicine })` |
| `src/api/index.ts` | экспорт типа `TelemedicineOffer` |
| `src/modules/appointment/hooks/use-telemedicine-offer.ts` (новый) | `useTelemedicineOffer(enabled)`, key `['appointments','telemedicine']`, `staleTime: 0` |
| `src/modules/appointment/hooks/use-specializations.ts` | шлёт `isTelemedicine=true`, key с типом приёма, белый список «Терапевт» удалён |
| `src/modules/insurance/hooks/use-medic-service.ts` | параметр `enabled` |
| `src/modules/appointment/lib/visit-price.ts` (новый) | чистая `visitPriceOf` |
| `src/modules/appointment/lib/__tests__/visit-price.test.ts` (новый) | 10 тестов |
| `src/modules/appointment/types.ts` | `VisitPrice.serviceName` |
| `src/modules/appointment/context/create-appointment-context.tsx` | телемед-цена, отключение medic-service/service-price, тост ошибки, payload без `medicServiceOid` |
| `src/modules/appointment/forms/create-appointment-form/ui/create-appointment-form.tsx` | сброс специальности/врача/слота при смене типа |
| `src/modules/appointment/forms/create-appointment-form/ui/appointment-price.tsx` | условие `doctorId && visitPrice`, название из `visitPrice.serviceName` |
| `src/shared/lib/i18n/locales/{ru,kk,en}.json` | `appointments:create.errorTelemedicineOffer` |
| `CLAUDE.md` | абзацы о телемедицине в «Med-account visit price» |

## Отклонения и решения по ходу

1. **`misApi.specializationsList` не регенерирован.** Бэкенд на `localhost:4000` не запущен,
   `src/api/generated/` не правился. Запрос со флагом идёт через рукописный
   `appointmentApi.specializationsList` (тот же `HttpClient`/`apiConfig`, тот же AuthUtils, что у
   остального `appointment-api.ts`). Обычный режим шлёт ровно `?branchId=` — как раньше.
   После `npm run generate-api` метод можно удалить.
2. **«Вынести в общую константу» vs «чек не трогать».** Чтобы не менять `fiscal.positions.ts`
   (AC-10, OQ-8), общая константа сделана в обратную сторону:
   `TELEMEDICINE_SERVICE_NAME = POSITION_NAMES.telemedicine` — одна строка-источник, файл чека
   не изменён.
3. **Тесты бэкенда.** В бэкенде не было тестового раннера (`npm test` намеренно падал), а
   AC-21 требует unit-тест фильтра и зелёный `npm test`. Добавлен только скрипт на встроенном
   `node:test` + уже установленный `ts-node`; новых зависимостей нет, `*.test.ts` исключён из
   `tsc` (как и было в `tsconfig.json`), в `dist` не попадает.
4. **Lint бэкенда.** Скрипта `lint` в бэкенде нет; `eslint` 9 с `.eslintrc.json` запускается
   только с `ESLINT_USE_FLAT_CONFIG=false`, и `eslint src` целиком падает с исключением внутри
   плагина (до моих правок тоже). Проверял каждый изменённый файл по отдельности — см. ниже.
5. Валидация `isTelemedicine` в `/mis/specializations` — `isIn(['true','false'])`, а не
   `isBoolean`: `isBoolean` пропускает `1/0`, которые потом не читались бы как `true`.
6. Проверка цены — строгое `amount !== config.telemedicine.price`, как в spec и как у
   `MED_ACCOUNT_TOPUP_AMOUNT_MISMATCH`.

## Как закрыт каждый AC

- **AC-1** `mis.service.createAppointment`: `booked_service: isTelemedicine ? config.telemedicine.serviceCode : medicServiceOid` — присланный `medicServiceOid` игнорируется. Проверено чтением кода (рантайм МИС недоступен).
- **AC-2** Платная запись идёт через тот же `misService.createAppointment` из `bookPaidAppointment` с `isTelemedicine: metadata.isTelemedicine` → тот же код.
- **AC-3** Для `isTelemedicine: false` — `medicServiceOid`, как раньше.
- **AC-4** `beforePayment = ensurePayable`: `ensureTelemedicinePrice` (409 `APPOINTMENT_TELEMEDICINE_PRICE_MISMATCH_MESSAGE` + `warn` с `amount`/`expected`) **до** `ensureBookable`. `runBeforePayment` вызывается в `initPayment` до `payment.create` и до FreedomPay — записи `Payment` нет, в провайдер ничего не уходит.
- **AC-5** Для `isTelemedicine: false` `ensureTelemedicinePrice` сразу возвращается.
- **AC-6** `router.get('/telemedicine', authenticate, asyncHandler(controller.getTelemedicineOffer))` зарегистрирован сразу после `/history`, до `/:id`; ответ `{ success: true, telemedicine: { price, serviceName } }`; без токена — 401 от `authenticate`.
- **AC-7** Все три значения читаются из env в `config.telemedicine`; сервис/хендлер/фильтр используют только `config.*`.
- **AC-8** `filterTelemedicineSpecializations` по подстрокам `УЗИ, МАССАЖ, СТОМАТОЛОГ, ВЫЕЗДН, ПСИХОЛОГ, РЕНТГЕН` (обе стороны в upper case). Тест на реальных названиях из OQ-2 + обычных специальностях.
- **AC-9** Без параметра / с `false` сервис возвращает `response.specialties` как есть.
- **AC-10** `fiscal.positions.ts` не изменён (`git status` чист по нему).
- **AC-11** Белый список «Терапевт» удалён; в телемедицине запрос с `isTelemedicine=true`, на клиенте остаются только общие исключения.
- **AC-12** В обычном режиме запрос `?branchId=` и тот же клиентский фильтр.
- **AC-13** Смена типа сбрасывает `specializationId`, `doctorId`, `timeSlot` → `isBookingEnabled = false`.
- **AC-14** Платный телемед: `visitPriceOf` → `{ price: offer.price, discountedPrice: null, serviceName: offer.serviceName }`; `useMedicService(..., !isTelemedicine)` и `useServicePrice(..., !isTelemedicine && …)` выключены; `medicService` в контексте для телемедицины принудительно `null` (даже из кэша).
- **AC-15** `paymentApi.initCreate`: `amount = discountedPrice ?? price` (= 6000), `description`/`metadata.serviceName` = `visitPrice.serviceName`, `medicServiceOid` только для очного.
- **AC-16** `isBookingEnabled` требует `visitPrice` для платного; пока оффер не загружен или упал — `null`. При `isError` — `useEffect` показывает тост `appointments:create.errorTelemedicineOffer`.
- **AC-17** Медсчёт + телемедицина: `isPaidVisit = false` → оффер не запрашивается, medic-service/service-price выключены, `visitPrice = null` (нет карточки), `bookAppointment` идёт в `createAppointmentMutation` (`/mis/create-appointment`, `isTelemedicine: true`, без `medicServiceOid`).
- **AC-18** То же для прочих программ.
- **AC-19** Существующий `onError` у `initAppointmentPaymentMutation` показывает `response.data.message`; `onSuccess` с навигацией в оплату не вызывается.
- **AC-20** Очный приём: `visitPriceOf` для `isTelemedicine: false` повторяет прежнюю логику (покрыто тестами), `serviceName = medicService.service`, `medicServiceOid` отправляется в обоих флоу.
- **AC-21** App: `visit-price.test.ts` (телемед платный/без оффера/медсчёт/программа; очный платный со скидкой, без скидки, ожидание скидки, без услуги, медсчёт, программа). Backend: `mis.specializations.test.ts` (6 тестов). Результаты ниже.
- **AC-22** CLAUDE.md обоих репозиториев обновлены.

## Проверки

Backend:
- `npm run build` — exit 0 (до и после).
- `npm test` — 6/6 pass (до изменений скрипт по замыслу падал).
- `ESLINT_USE_FLAT_CONFIG=false npx eslint <файл>` по каждому изменённому файлу — чисто, кроме
  двух уже существующих/инфраструктурных: `appointments.routes.ts` `import/order` на строке 1
  (пустая строка между `express` и `@prisma/client` — было до меня) и тест-файл
  (`parserOptions.project` не включает `*.test.ts`, т.к. `tsconfig.json` их исключает).
  Тест-файл отдельно прогнан через `tsc --noEmit` — без ошибок; `prettier --check` по новым
  файлам — чисто.

App:
- `npx jest` — до: 9 suites pass / 1 fail (`__tests__/App.test.tsx`, Jest не парсит ESM-зависимость),
  53 теста pass. После: 10 suites pass / тот же 1 fail, 63 теста pass (+10 новых).
- `npx eslint src` — до: 43 problems (33 errors, 10 warnings); после: те же 43, набор сообщений
  идентичен (новых ошибок нет). Ошибки в `create-appointment-context.tsx` (`any`, prettier на
  `CREATE_ERROR_KEYS`, `console`) и `use-medic-service.ts` (`console`) — существовавшие.
- `npm run lint` (`eslint .`) — не завершился ни до изменений (остановлен после ~13 мин CPU),
  ни после (остановлен после ~20 мин CPU): `.eslintrc.json` без `ignorePatterns`, и `eslint .`
  обходит в т.ч. `ios/Pods` (354 MB). Поэтому сравнение сделано по `npx eslint src` (выше) —
  это весь код приложения.
- `npx tsc --noEmit` — 3 ошибки только в `src/api/generated/Payment.ts` (существовавшие), в
  изменённых файлах ошибок нет.

Не проверено вживую (нет запущенного бэкенда/МИС/устройства): реальные ответы МИС, ручной
проход формы. Порядок выкатки: сначала бэкенд, потом сборка приложения.
