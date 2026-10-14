import {
  CALL_CENTER_PHONE,
  NO_PROGRAMS_CALL_CENTER_PHONE,
} from '@/shared/constants';

import { usePrograms } from './use-programs';

/**
 * The call centre to point the patient at. Someone with no programme at all — the insurer
 * returned none, or does not know them — is served by its own line; while the list is
 * loading or failed to load, the regular one is shown.
 */
export const useCallCenterPhone = () => {
  const { programs, loadedPrograms, isNotAuthorized } = usePrograms();

  const hasNoPrograms =
    isNotAuthorized || (loadedPrograms && programs.length === 0);

  return hasNoPrograms ? NO_PROGRAMS_CALL_CENTER_PHONE : CALL_CENTER_PHONE;
};
