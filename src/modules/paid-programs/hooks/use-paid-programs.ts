import { useQuery } from '@tanstack/react-query';

import { checkupsApi, insuranceApi } from '@/api';
import { GET_PAID_PROGRAMS_QUERY } from '@/shared/constants';

import { mapCheckup } from '../lib/map-checkup';
import { mapPayProgram } from '../lib/map-pay-program';
import { PaidProgram, PaidProgramCategory } from '../types';

const fetchMedPlans = async (): Promise<PaidProgram[]> => {
  const { data } = await insuranceApi.payProgramsList();

  return (data?.payPrograms || []).map(mapPayProgram);
};

const fetchCheckups = async (): Promise<PaidProgram[]> => {
  const { data } = await checkupsApi.checkupsList();

  return (data?.checkups || []).map(mapCheckup);
};

/**
 * Catalogue of paid programs for one tab.
 *
 * `MED_PLAN` is proxied from the MIS by `GET /insurance/pay-programs`; `CHECKUP` comes
 * from our own catalogue at `GET /checkups`. The two tabs are cached separately so
 * switching between them does not refetch the other one.
 */
export const usePaidPrograms = (category: PaidProgramCategory) => {
  const {
    data,
    isLoading: loadingPrograms,
    isFetching: fetchingPrograms,
    refetch: refetchPrograms,
  } = useQuery({
    queryKey: [GET_PAID_PROGRAMS_QUERY, category],
    queryFn: category === 'MED_PLAN' ? fetchMedPlans : fetchCheckups,
    staleTime: 1000 * 60 * 10,
  });

  return {
    programs: data || [],
    loadingPrograms,
    fetchingPrograms,
    refetchPrograms,
  };
};
