import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { FC } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';

import { AppointmentRequests, MyAppointments } from '@/modules/appointment';
import { Button } from '@/shared/components/button';
import {
  ClipboardClockIcon,
  HistoryIcon,
  SelectCaretIcon,
} from '@/shared/icons';
import { MainLayout } from '@/shared/layout/main-layout';
import { useNavigation, routes } from '@/shared/navigation';
import { colors, useTheme } from '@/shared/theme';

export const AppointmentsScreen: FC = () => {
  const { navigate } = useNavigation();
  const { colors: themeColors } = useTheme();
  const queryClient = useQueryClient();
  const isFetchingAppointments = useIsFetching({ queryKey: ['appointments'] });

  const onRefresh = () => {
    queryClient.refetchQueries({ queryKey: ['appointments-history'] });
    queryClient.refetchQueries({ queryKey: ['appointment-requests'] });
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.wrapper}
        refreshControl={
          <RefreshControl
            refreshing={!!isFetchingAppointments}
            onRefresh={onRefresh}
          />
        }
      >
        <MainLayout>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigate(routes.AppointmentHistory)}
            style={[
              styles.historyButton,
              { backgroundColor: themeColors.blue['100'] },
            ]}
          >
            <View
              style={[
                styles.historyIconWrap,
                { backgroundColor: themeColors.blue['150'] },
              ]}
            >
              <HistoryIcon
                width={22}
                height={22}
                color={themeColors.blue['400']}
              />
            </View>
            <View style={styles.historyTexts}>
              <Text
                style={[
                  styles.historyTitle,
                  { color: themeColors.blue['400'] },
                ]}
              >
                История записей
              </Text>
            </View>
            <View style={styles.historyCaret}>
              <SelectCaretIcon color={themeColors.blue['400']} />
            </View>
          </TouchableOpacity>
          <AppointmentRequests />
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
    paddingBottom: 120,
    paddingHorizontal: 16,
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
  divider: {
    height: 1,
    backgroundColor: colors.gray['250'],
    marginTop: 16,
    marginBottom: 8,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginHorizontal: -16,
    gap: 12,
    marginBottom: 16,
  },
  historyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyTexts: {
    flex: 1,
    gap: 2,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  historySubtitle: {
    fontSize: 13,
    fontWeight: '400',
  },
  historyCaret: {
    transform: [{ rotate: '-90deg' }],
  },
});
