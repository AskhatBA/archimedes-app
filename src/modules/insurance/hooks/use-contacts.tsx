import { useQuery } from '@tanstack/react-query';

import { insuranceApi } from '@/api';
import { GET_INSURANCE_CONTACTS_QUERY } from '@/shared/constants';

export const useContacts = () => {
  const { data: contacts, isLoading: loadingContacts } = useQuery({
    queryKey: [GET_INSURANCE_CONTACTS_QUERY],
    queryFn: async () => {
      const data = await insuranceApi.contactsList();
      return data.data?.contacts;
    },
  });

  return { contacts, loadingContacts };
};
