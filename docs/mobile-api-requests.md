# Примеры запросов мобильного приложения Archimedes

Все запросы идут на один backend:

```
https://mis.archimedes.kz/mobile-app/v1/api
```

Ниже — `curl`-примеры всех запросов, которые делает приложение (iOS и Android одинаково).
Значения в `{{...}}` — плейсхолдеры, их нужно подставить.

## Общее

| Заголовок | Значение |
|---|---|
| `Content-Type` | `application/json` — для запросов с телом |
| `Authorization` | `Bearer {{accessToken}}` — для всех запросов после входа |

- `accessToken` живёт ~15 минут, обновляется через `POST /auth/refresh`.
- На `401` с `message: "TOKEN_EXPIRED"` приложение просит PIN/биометрию и получает новую сессию;
  любой другой `401` — разлогин.
- Ошибки приходят как JSON, код ошибки — в `response.data.message`.
- Телефон — 11 цифр с `7` в начале (`77001234567`), ИИН — 12 цифр.
- Время записи передаётся с зоной `+05:00`.

```bash
export API=https://mis.archimedes.kz/mobile-app/v1/api
export TOKEN={{accessToken}}
```

---

## 1. Авторизация

### Проверка аккаунта (перед входом/регистрацией)

```bash
curl "$API/user/check-account?iin={{iin}}&phone={{phone}}"
```

Ответ: `{ success, existsInDb, existsInMis, existsInInsurance, isPhoneMatch }`

### Вход: запрос OTP

```bash
curl -X POST "$API/auth/request-otp" \
  -H "Content-Type: application/json" \
  -d '{ "phone": "{{phone}}", "iin": "{{iin}}" }'
```

### Вход: подтверждение OTP

```bash
curl -X POST "$API/auth/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{ "phone": "{{phone}}", "otp": "1234" }'
```

Ответ содержит `accessToken` и `refreshToken`.

### Регистрация (3 шага)

```bash
curl -X POST "$API/auth/register/start" \
  -H "Content-Type: application/json" \
  -d '{ "phone": "{{phone}}", "iin": "{{iin}}" }'

curl -X POST "$API/auth/register/verify-otp" \
  -H "Content-Type: application/json" \
  -d '{ "phone": "{{phone}}", "iin": "{{iin}}", "otp": "1234" }'
# -> registrationToken

curl -X POST "$API/auth/register/complete" \
  -H "Content-Type: application/json" \
  -d '{
    "registrationToken": "{{registrationToken}}",
    "firstName": "Иван",
    "lastName": "Иванов",
    "patronymic": "Иванович",
    "birthDate": "1990-01-01",
    "gender": "M"
  }'
```

### Обновление сессии

```bash
curl -X POST "$API/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{ "refreshToken": "{{refreshToken}}" }'
```

### PIN и биометрия

```bash
# Установить PIN
curl -X POST "$API/auth/pin" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{ "pin": "1234" }'

# Вход по PIN (без токена) -> accessToken, refreshToken
curl -X POST "$API/auth/pin/verify" \
  -H "Content-Type: application/json" -d '{ "phone": "{{phone}}", "pin": "1234" }'

# Включить/выключить биометрию
curl -X POST "$API/auth/biometric" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{ "enabled": true }'
```

### История входов и выход

```bash
curl "$API/auth/sessions?limit=50&offset=0" -H "Authorization: Bearer $TOKEN"

curl -X POST "$API/auth/logout" -H "Authorization: Bearer $TOKEN"
```

---

## 2. Профиль пациента

```bash
# Профиль
curl "$API/patient/profile" -H "Authorization: Bearer $TOKEN"

# Создание профиля
curl -X POST "$API/patient/profile" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Иван",
    "lastName": "Иванов",
    "patronymic": "Иванович",
    "birthDate": "1990-01-01",
    "iin": "{{iin}}",
    "gender": "M"
  }'

# Поиск пациента в МИС по ИИН
curl "$API/mis/find-patient?iin={{iin}}" -H "Authorization: Bearer $TOKEN"

# Создание пациента в МИС
curl -X POST "$API/mis/create-patient" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "{{phone}}",
    "firstName": "Иван",
    "lastName": "Иванов",
    "patronymic": "Иванович",
    "gender": "M",
    "birthDate": "1990-01-01",
    "iin": "{{iin}}"
  }'
```

---

## 3. Запись к врачу (МИС)

```bash
# Филиалы
curl "$API/mis/branches" -H "Authorization: Bearer $TOKEN"

# Специализации филиала
curl "$API/mis/specializations?branchId={{branchId}}" -H "Authorization: Bearer $TOKEN"

# Врачи
curl "$API/mis/doctors?branchId={{branchId}}&specializationId={{specializationId}}" \
  -H "Authorization: Bearer $TOKEN"

# Свободные слоты врача
curl "$API/mis/doctor/{{doctorId}}/available-slots?startDate=2026-10-06&endDate=2026-10-20&branchId={{branchId}}" \
  -H "Authorization: Bearer $TOKEN"

# Услуга врача (цена, oid услуги)
curl "$API/insurance/medic-service?clinicId={{branchExternalId}}&medicIIN={{doctorIin}}" \
  -H "Authorization: Bearer $TOKEN"

# Цена со скидкой медсчёта
curl "$API/insurance/service-price?clinicId={{branchExternalId}}&serviceId={{medicServiceOid}}" \
  -H "Authorization: Bearer $TOKEN"
```

### Создание записи (по страховой программе / медсчёту)

```bash
curl -X POST "$API/mis/create-appointment" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": "{{doctorId}}",
    "branchId": "{{branchId}}",
    "startTime": "2026-10-10T10:00:00+05:00",
    "endTime": "2026-10-10T10:30:00+05:00",
    "patientId": "{{familyMemberId}}",
    "insuranceProgramId": "{{programId}}",
    "isTelemedicine": false,
    "medicServiceOid": "{{medicServiceOid}}"
  }'
```

`patientId` передаётся только при записи родственника.
Платная запись создаётся не здесь, а через оплату (см. раздел 6, `purpose: "APPOINTMENT"`).

### Мои записи

Если выбран родственник, ко всем четырём запросам добавляются
`?familyMemberId={{benId}}&programId={{programId}}`.

```bash
# Предстоящие
curl "$API/mis/appointments" -H "Authorization: Bearer $TOKEN"

# Прошедшие (МИС)
curl "$API/mis/appointment-history" -H "Authorization: Bearer $TOKEN"

# Заявки на запись
curl "$API/mis/appointment-requests" -H "Authorization: Bearer $TOKEN"

# Детали записи
curl "$API/mis/appointments/{{misAppointmentId}}" -H "Authorization: Bearer $TOKEN"

# Пример для родственника
curl "$API/mis/appointments?familyMemberId={{benId}}&programId={{programId}}" \
  -H "Authorization: Bearer $TOKEN"
```

### История записей (наша БД, включая отменённые)

```bash
curl "$API/appointments/history" -H "Authorization: Bearer $TOKEN"
```

### Отмена записи

```bash
# Предпросмотр: сколько вернётся
curl "$API/appointments/{{appointmentId}}/cancellation" -H "Authorization: Bearer $TOKEN"

# Отмена
curl -X PATCH "$API/appointments/{{appointmentId}}/cancel" -H "Authorization: Bearer $TOKEN"
```

`{{appointmentId}}` — наш id или id из МИС, принимаются оба.
Коды ошибок: `APPOINTMENT_NOT_FOUND`, `APPOINTMENT_NOT_CANCELLABLE`, `APPOINTMENT_ALREADY_STARTED`.

### Результаты анализов

```bash
curl "$API/mis/laboratory-results" -H "Authorization: Bearer $TOKEN"
```

---

## 4. Страхование

```bash
# Программы пациента
curl "$API/insurance/programs" -H "Authorization: Bearer $TOKEN"
curl "$API/insurance/programs/{{programId}}" -H "Authorization: Bearer $TOKEN"

# Семья по программе
curl "$API/insurance/family?programId={{programId}}" -H "Authorization: Bearer $TOKEN"

# Баланс медсчёта
curl "$API/insurance/med-account" -H "Authorization: Bearer $TOKEN"

# Платные программы
curl "$API/insurance/pay-programs" -H "Authorization: Bearer $TOKEN"

# Справочники
curl "$API/insurance/cities" -H "Authorization: Bearer $TOKEN"
curl "$API/insurance/clinic-types" -H "Authorization: Bearer $TOKEN"
curl "$API/insurance/contacts" -H "Authorization: Bearer $TOKEN"
curl "$API/insurance/news" -H "Authorization: Bearer $TOKEN"
curl "$API/insurance/clinics-mo" -H "Authorization: Bearer $TOKEN"

# Медицинская сеть
curl "$API/insurance/medical-network?cityId={{cityId}}&programId={{programId}}&type={{clinicTypeId}}" \
  -H "Authorization: Bearer $TOKEN"

# Прайс-лист клиники
curl "$API/insurance/price-list?clinicId={{clinicOid}}" -H "Authorization: Bearer $TOKEN"
```

### Электронные направления

```bash
curl "$API/insurance/electronic-referrals?programId={{programId}}" -H "Authorization: Bearer $TOKEN"

curl -X PATCH "$API/insurance/electronic-referrals/{{electronicReferralId}}/service-status" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{ "serviceStatus": 1, "satisfactionLevel": "5" }'
```

`serviceStatus` — `0 | 1 | 2`.

### QR-регистрация в клинике

```bash
curl "$API/insurance/qr/appointments?clinicId={{clinicGuid}}" -H "Authorization: Bearer $TOKEN"

curl "$API/insurance/qr/submit-appointment?clinicId={{clinicGuid}}&appCode={{appCode}}" \
  -H "Authorization: Bearer $TOKEN"
```

### Компенсация (возмещение)

```bash
curl "$API/insurance/refund-requests" -H "Authorization: Bearer $TOKEN"

curl -X POST "$API/insurance/refund-request" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-09-01",
    "amount": 15000,
    "personId": "{{benId}}",
    "programId": "{{programId}}",
    "comments": "Приём терапевта",
    "category": 0,
    "files": [
      { "fileType": "Кассовый чек", "fileName": "cheque.pdf", "content": "{{base64}}" }
    ]
  }'
```

`category`: `0` — АПП, `2` — стационар, `4` — стоматология, `5` — медикаменты.
Файлы передаются в base64 прямо в JSON.

---

## 5. Медсчёт и чекапы

```bash
# Варианты пополнения медсчёта
curl "$API/med-account/options" -H "Authorization: Bearer $TOKEN"

# История пополнений
curl "$API/med-account/topups" -H "Authorization: Bearer $TOKEN"

# Чекапы
curl "$API/checkups" -H "Authorization: Bearer $TOKEN"
```

---

## 6. Оплата (FreedomPay)

`POST /payment/init` возвращает `{ paymentId, paymentUrl }`. Приложение открывает `paymentUrl`
в WebView, затем опрашивает статус платежа.

### Пополнение медсчёта

```bash
curl -X POST "$API/payment/init" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 20000,
    "description": "Пополнение медсчёта",
    "purpose": "MED_ACCOUNT_TOPUP",
    "metadata": { "optionId": "{{optionId}}" }
  }'
```

### Платная запись к врачу

```bash
curl -X POST "$API/payment/init" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 12000,
    "description": "Консультация терапевта",
    "purpose": "APPOINTMENT",
    "metadata": {
      "doctorId": "{{doctorId}}",
      "branchId": "{{branchId}}",
      "startTime": "2026-10-10T10:00:00+05:00",
      "endTime": "2026-10-10T10:30:00+05:00",
      "isTelemedicine": false,
      "medicServiceOid": "{{medicServiceOid}}",
      "doctorName": "Иванов И.И.",
      "branchName": "Archimedes",
      "branchAddress": "г. Алматы, ...",
      "serviceName": "Консультация терапевта"
    }
  }'
```

`familyMemberId` добавляется в `metadata` при записи родственника.

### Платные программы

```bash
curl -X POST "$API/payment/init" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "description": "Программа ...",
    "purpose": "PAID_PROGRAM",
    "metadata": {
      "items": [
        { "category": "{{category}}", "id": "{{programId}}", "code": "{{code}}", "title": "Программа ...", "price": 50000 }
      ]
    }
  }'
```

### Статус, незавершённые платежи, отмена

```bash
curl "$API/payment/status/{{paymentId}}" -H "Authorization: Bearer $TOKEN"

curl "$API/payment/pending?purpose=APPOINTMENT" -H "Authorization: Bearer $TOKEN"

curl -X POST "$API/payment/{{paymentId}}/cancel" -H "Authorization: Bearer $TOKEN"
```

Статусы: `PENDING`, `SUCCESS`, `FAILED`, `CANCELLED`.

---

## 7. Уведомления и прочее

```bash
# Регистрация push-токена (FCM)
curl -X POST "$API/notifications/devices" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "deviceId": "{{fcmToken}}", "platform": "IOS" }'

# Список уведомлений
curl "$API/notifications?limit=50&offset=0" -H "Authorization: Bearer $TOKEN"

# Количество непрочитанных
curl "$API/notifications/unread-count" -H "Authorization: Bearer $TOKEN"

# Прочитать одно / все
curl -X PATCH "$API/notifications/{{notificationId}}/read" -H "Authorization: Bearer $TOKEN"
curl -X PATCH "$API/notifications/read-all" -H "Authorization: Bearer $TOKEN"

# Проверка версии приложения (принудительное обновление)
curl "$API/app/version?platform=ios" -H "Authorization: Bearer $TOKEN"
```
