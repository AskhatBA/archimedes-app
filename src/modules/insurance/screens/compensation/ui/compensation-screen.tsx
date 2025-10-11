import { FC } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';

import { Button } from '@/shared/components/button';
import { FilePenIcon } from '@/shared/icons';
import { MainLayout } from '@/shared/layout/main-layout';
import { routes, useNavigation } from '@/shared/navigation';
import { colors } from '@/shared/theme';

import { CompensationHistory } from '../components/compensation-history';

export const CompensationScreen: FC = () => {
  const { navigate } = useNavigation();

  return (
    <>
      <MainLayout>
        <ScrollView>
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
