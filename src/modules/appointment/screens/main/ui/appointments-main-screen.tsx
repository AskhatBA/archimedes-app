import { FC } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';

import { Button } from '@/shared/components/button';
import { ClipboardClockIcon } from '@/shared/icons';
import { MainLayout } from '@/shared/layout/main-layout';
import { useNavigation, routes } from '@/shared/navigation';
import { colors } from '@/shared/theme';

import { MyAppointments } from '../components/my-appointments';

export const AppointmentsMainScreen: FC = () => {
  const { navigate } = useNavigation();

  return (
    <>
      <ScrollView contentContainerStyle={styles.wrapper}>
        <MainLayout>
          <MyAppointments />
        </MainLayout>
      </ScrollView>
      <View style={styles.createAppointmentButton}>
        <Button
          icon={
            <ClipboardClockIcon width={22} height={22} color={colors.white} />
          }
          onPress={() => {
            navigate(routes.CreateAppointment);
          }}
        >
          Записаться на прием
        </Button>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  createAppointmentButton: {
    width: '100%',
    position: 'absolute',
    padding: 16,
    bottom: 0,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  content: {
    flex: 1,
    gap: 24,
  },
});
