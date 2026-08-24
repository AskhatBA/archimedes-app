import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { GET_PAID_PROGRAMS_QUERY } from '@/shared/constants';

import { PAID_PROGRAMS_MOCK } from '../mocks/paid-programs';
import { PaidProgram, PaidProgramCategory } from '../types';

/** Stands in for the network round-trip so the list renders its loading state honestly. */
const MOCK_LATENCY_MS = 400;

const fetchPaidPrograms = async (): Promise<PaidProgram[]> =>
  new Promise(resolve => {
    setTimeout(() => resolve(PAID_PROGRAMS_MOCK), MOCK_LATENCY_MS);
  });

/**
 * Catalogue of paid programs, filtered by tab.
 *
 * Backed by front-end mocks — swapping `queryFn` for the real client is the only
 * change needed once the endpoint ships.
 */
export const usePaidPrograms = (category: PaidProgramCategory) => {
  const {
    data,
    isLoading: loadingPrograms,
    isFetching: fetchingPrograms,
    refetch: refetchPrograms,
  } = useQuery({
    queryKey: [GET_PAID_PROGRAMS_QUERY],
    queryFn: fetchPaidPrograms,
    staleTime: Infinity,
  });

  const programs = useMemo(
    () => (data || []).filter(program => program.category === category),
    [data, category],
  );

  return {
    programs,
    loadingPrograms,
    fetchingPrograms,
    refetchPrograms,
  };
};
