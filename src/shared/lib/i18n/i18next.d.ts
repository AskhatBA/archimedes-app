import 'i18next';

import { DEFAULT_NAMESPACE } from './constants';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof DEFAULT_NAMESPACE;
    returnNull: false;
  }
}
