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

Feature code lives in `src/modules/` and is organized by domain: `appointment`, `auth`, `insurance`, `medbot`, `medical-tests`, `notifications`, `user`. Each module owns its hooks, components, context, and types. Screens in `src/screens/` are thin — they import from modules and wire up navigation/layout.

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
