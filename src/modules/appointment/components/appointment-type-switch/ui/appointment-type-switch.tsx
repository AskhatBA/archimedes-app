import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ClipboardClockIcon, VideoIcon } from '@/shared/icons';
import { colors } from '@/shared/theme';

import { AppointmentTypeSwitchTab } from '../types';

interface AppointmentTypeSwitchProps {
  appointmentType?: AppointmentTypeSwitchTab;
  changeAppointmentType?: (type: AppointmentTypeSwitchTab) => void;
}

export const AppointmentTypeSwitch: FC<AppointmentTypeSwitchProps> = ({
  appointmentType,
  changeAppointmentType,
}) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[styles.tab, appointmentType === 'regular' && styles.activeTab]}
        onPress={() => changeAppointmentType('regular')}
      >
        <ClipboardClockIcon
          width={20}
          height={20}
          color={
            appointmentType === 'regular'
              ? colors.blue['400']
              : colors.gray['500']
          }
        />
        <Text
          style={[
            styles.tabText,
            appointmentType === 'regular' && styles.activeTabText,
          ]}
        >
          Обычный прием
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          appointmentType === 'telemedicine' && styles.activeTab,
        ]}
        onPress={() => changeAppointmentType('telemedicine')}
      >
        <VideoIcon
          width={20}
          height={20}
          color={
            appointmentType === 'telemedicine'
              ? colors.blue['400']
              : colors.gray['500']
          }
        />
        <Text
          style={[
            styles.tabText,
            appointmentType === 'telemedicine' && styles.activeTabText,
          ]}
        >
          Телемедицина
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray['200'],
  },
  activeTab: {
    backgroundColor: colors.blue['100'],
  },
  tabText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
    color: colors.gray['500'],
  },
  activeTabText: {
    color: colors.blue['400'],
  },
});
