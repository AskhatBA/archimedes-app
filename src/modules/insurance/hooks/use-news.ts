import { useQuery } from '@tanstack/react-query';

import { InsuranceNewsItem, insuranceApi } from '@/api';
import { GET_INSURANCE_NEWS_QUERY } from '@/shared/constants';

export const getNewsKey = (item: InsuranceNewsItem) =>
  `${item.date}-${item.title}`;

export const useNews = () => {
  const { data: news, isLoading: loadingNews } = useQuery({
    queryKey: [GET_INSURANCE_NEWS_QUERY],
    queryFn: async () => (await insuranceApi.newsList()).data.news ?? [],
  });

  return {
    news,
    loadingNews,
  };
};
