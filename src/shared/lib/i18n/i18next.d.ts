import 'i18next';

import { DEFAULT_NAMESPACE } from './constants';
import { resources } from './i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof DEFAULT_NAMESPACE;
    resources: (typeof resources)['ru'];
    returnNull: false;
  }
}
