import { useEffect } from 'react';

import { usePageHeaderStore } from '@/shared/store';

interface PageHeaderProps {
  title: string;
}

export const usePageHeader = ({ title }: PageHeaderProps) => {
  const setTitle = usePageHeaderStore(state => state.setTitle);

  useEffect(() => {
    if (title) setTitle(title);
    return () => setTitle('');
  }, [title]);
};
