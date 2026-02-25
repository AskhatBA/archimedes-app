import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl } from 'react-native';

import { CompensationHistory } from '@/modules/insurance';
import { Button } from '@/shared/components/button';
import { FilePenIcon } from '@/shared/icons';
import { MainLayout } from '@/shared/layout/main-layout';
import { routes, useNavigation } from '@/shared/navigation';
import { colors } from '@/shared/theme';

export const CompensationScreen: FC = () => {
  const { navigate } = useNavigation();
  const queryClient = useQueryClient();
  const isFetchingCompensations = useIsFetching({
    queryKey: ['user-compensation-requests'],
  });

  const onRefresh = () => {
    queryClient.refetchQueries({ queryKey: ['user-compensation-requests'] });
  };

  return (
    <>
      <MainLayout>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={!!isFetchingCompensations}
              onRefresh={onRefresh}
            />
          }
        >
          <CompensationHistory />
        </ScrollView>
      </MainLayout>
      <View style={styles.compensationButton}>
        <Button
          icon={<FilePenIcon width={22} height={22} color={colors.white} />}
          onPress={() => navigate(routes.CompensationRequest)}
        >
          Заявка на возмещение
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: 700,
  },
  compensationButton: {
    width: '100%',
    position: 'absolute',
    padding: 16,
    bottom: 0,
    backgroundColor: colors.white,
    shadowColor: colors.gray['700'],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
