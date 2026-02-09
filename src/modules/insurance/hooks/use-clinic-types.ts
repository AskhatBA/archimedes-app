import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';
import { GET_INSURANCE_CLINIC_TYPES } from '@/shared/constants';

export const useClinicTypes = () => {
  const { data, isLoading } = useQuery({
    queryKey: [GET_INSURANCE_CLINIC_TYPES],
    queryFn: async () => (await insuranceApi.clinicTypesList()).data,
  });

  return {
    clinicTypes: data?.clinicTypes || [],
    loadingClinicTypes: isLoading,
  };
};
