import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';

interface PageHeaderProps {
  title: string;
}

export const usePageHeader = ({ title }: PageHeaderProps) => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setParams({ title } as undefined);
  }, [navigation]);
};
