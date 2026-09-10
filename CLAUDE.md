# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start Metro bundler
npm start

# Run on device/simulator
npm run android
npm run ios
npm run ios:local          # uses .env.local instead of .env

# Lint
npm run lint

# Tests
npm test
npx jest path/to/file.test.ts    # run a single test file
npx jest -t "test name"          # run tests matching a name

# Regenerate API clients from Swagger (requires backend running on localhost:4000)
npm run generate-api
```

iOS first-time setup:
```bash
bundle install
bundle exec pod install
```

## Architecture

### Module structure

Feature code lives in `src/modules/` and is organized by domain: `appointment`, `auth`, `insurance`, `med-account`, `medbot`, `medical-tests`, `notifications`, `paid-programs`, `payment`, `user`. Each module owns its hooks, components, context, and types. Screens in `src/screens/` are thin — they import from modules and wire up navigation/layout.

### Medical account top-up

The balance card on the home screen (`MedAccountCard`) is itself the way in to topping the
account up — the balance is what makes someone want to, so the whole card navigates to
`routes.MedAccountTopup`. The balance is read from the insurer through
`useMedAccount` in `@/modules/insurance`; the top-up flow is `@/modules/med-account`.

`MedAccountTopup` is deliberately **not** the paid-programs cart. A top-up is one sum paid
once, so the list is a radio group with a single confirm bar — picking a second amount
replaces the first, and there is nothing to add up. The amounts come from our own backend
(`GET /med-account/options`) and are editable in the dashboard, so the screen never
hard-codes them; free-form amounts are not offered.

Checkout posts `POST /payment/init` with `purpose: 'MED_ACCOUNT_TOPUP'` and only
`{ optionId }` as metadata — the amount charged is verified against the catalogue
server-side, so an amount that went stale on the device is refused before the payer is sent
to the provider, and the reason is surfaced in the toast. The top-up itself is recorded by
the backend when the payment settles, so it lands even if the app is closed on the
provider's page.

### Cancelling an appointment

Every appointment list on screen is proxied live from MIS, so what the app holds is a MIS
id, not ours. Both cancellation endpoints accept either, which is why nothing here has to
resolve one into the other.

The entry points are the ⋯ button on `AppointmentCard` and a destructive button at the
bottom of `AppointmentDetailsScreen` (shown only for a future visit in a live MIS status —
the backend refuses the rest anyway, and offering a button that cannot work is worse than
not offering it). Both open `CancelAppointmentDrawer`.

The drawer is a sheet rather than an alert because of the money. Cancelling a paid visit at
least 12 hours ahead refunds everything; later than that the clinic keeps 30%, and the
patient has to see which of the two applies **before** tapping, not in the receipt
afterwards. The figures are never computed on the device: the split moves with the clock, so
opening the sheet reads `GET /appointments/{id}/cancellation` (`useCancellationPreview`,
`staleTime: 0`) and renders the backend's own `paidAmount` / `feeAmount` / `amount`. A visit
booked through an insurance programme comes back with `refund: null` and gets a plain
confirmation — the insurer paid, so there is nothing to return.

Keeping the appointment is the primary button and cancelling is a plain text action, the
same stance as `CancelPaymentDrawer`: the sheet makes a destructive tap deliberate rather
than pushing it.

`useCancelAppointment` calls `PATCH /appointments/{id}/cancel`. Two things shape how the
result is worded:

- The backend removes the visit in MIS **first**, so a rejection means nothing changed —
  the visit is still booked and no money moved. `APPOINTMENT_ALREADY_STARTED`,
  `APPOINTMENT_NOT_CANCELLABLE` and `APPOINTMENT_NOT_FOUND` arrive as
  `response.data.message` (read with `cancellationErrorCode`) and each gets its own
  wording — a patient told "try again" about a visit that has already started will just
  try again.
- The refund comes back `PENDING`, because it is only *queued* for FreedomPay. The toast
  therefore reports the sum agreed, not money that has arrived, and the sheet says
  crediting takes a few business days.

`appointmentApi` (`src/api/appointment-api.ts`) is hand-written for the same reason as
`payment-api.ts`: the generated `Appointments` client needs `npm run generate-api` against a
running backend and is not wired into `api.ts` at all. Re-running the generator makes it
redundant.

### Med-account visit price

The booking form shows a price for a paid visit (`/insurance/medic-service`) and for a
visit under the programme flagged `isMedAccount` — that one is paid from the медсчёт, while
every other programme is paid by the insurer and shows none. For the med-account visit
`useServicePrice` reads `GET /insurance/service-price` with the branch's `externalId` and
the medic-service `oid`, and `AppointmentPrice` strikes the full `price` out next to
`priceMedAccount` when the latter is set, or shows the full price alone when it is `null`
(the backend folds an empty or zero one into `null`). The price is informational: nothing
is charged in the app, so unlike a paid visit's it does not gate booking.

### API layer (`src/api/`)

All API clients are **auto-generated** from Swagger via `npm run generate-api` (hits `localhost:4000/api-docs.json` and writes to `src/api/generated/`). Never hand-edit files in `src/api/generated/`.

The generated clients are instantiated in `src/api/api.ts` and exported as singletons (`authApi`, `misApi`, `patientApi`, `insuranceApi`, `meetingsApi`, `notificationsApi`). `AuthUtils` wraps each client with Axios interceptors that inject the Bearer token and handle 401s by calling the logout callback registered via `setApiErrorHandler`.

Data fetching uses **TanStack Query** hooks that call these singletons. Mutations use `useMutation`, queries use `useQuery`.

### Auth flow

`AuthContextProvider` (`src/shared/lib/auth/auth-context.tsx`) bootstraps on mount: reads tokens from AsyncStorage, sets `isAuthenticated`, shows `ScreenLoader` during init. On success it calls `setApiErrorHandler(logout)` to wire 401 handling into every API client. Authentication is phone + OTP — `loginIin`/phone is held in context while navigating the sign-in flow.

`RootNavigator` checks `isAuthenticated` to pick the initial route: `TabNavigation` vs `SignIn`.

### Navigation

Two-level navigation:
- **`RootStack`** (stack): wraps everything. Contains auth screens (`SignIn`, `OtpVerification`, `CreateUser`) and all full-screen detail/flow screens (`CreateAppointment`, `AppointmentDetails`, `MedbotChat`, `CompensationRequest`, `ProgramDetails`, `ElectronicReferrals`, etc.).
- **`TabNavigator`** (bottom tabs): `Home`, `AppointmentsMain`, `Programs`, `Compensation`, `Profile`. Uses a custom `BottomTabBar`.

All route name constants are in `src/shared/navigation/routes.ts`. Always use `routes.*` constants — never string literals.

Navigation is accessed via the `useNavigation` hook from `src/shared/navigation` (wraps React Navigation's hook with typed helpers: `navigate`, `goBack`, `resetNavigation`).

### State management

- **TanStack Query** for all server state (fetching, caching, invalidation).
- **Zustand** (`src/shared/store/`) for lightweight global UI state (e.g. `usePageHeaderStore`).
- **React Context** for scoped multi-step flow state (e.g. `CreateAppointmentContext` coordinates form steps, API calls, and sub-hooks).
- **Formik + Yup** for form state and validation.

### Theme and styling

Styles are written with React Native `StyleSheet.create`. Design tokens live in `src/shared/theme/`: `colors`, `fonts`, `metrics`, `globalStyles`. Use `useTheme()` for dark/light mode variants. Always import colors from `@/shared/theme` rather than hard-coding values.

### Path alias

`@/` maps to `src/`. Use it for all cross-module imports.

### Environment

Environment variables are loaded via `react-native-dotenv` (module name `@env`). `.env` is the default; `.env.local` is used with `npm run ios:local`. `API_URL` points to the backend base URL.
