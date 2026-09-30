import { FC, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAppointmentRequests } from '@/modules/appointment/hooks/use-appointment-requests';
import { AppointmentsPatient } from '@/modules/appointment/types';
import { SelectCaretIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { colors } from '@/shared/theme';

import { AppointmentRequestCard } from './appointment-request-card';

interface AppointmentRequestsProps {
  /** Whose requests to list; the account owner's own when omitted. */
  patient?: AppointmentsPatient;
}

export const AppointmentRequests: FC<AppointmentRequestsProps> = ({
  patient,
}) => {
  const { appointmentRequests, isLoading } = useAppointmentRequests(patient);
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!appointmentRequests?.length) {
    return null;
  }

  return (
    <View style={[styles.container, { paddingBottom: isOpen ? 16 : 0 }]}>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen(prev => !prev)}
        activeOpacity={0.7}
      >
        <Text style={[styles.title, { color: colors.gray['700'] }]}>
          {t('appointments:requestsTitle')}
        </Text>
        <View style={[styles.caretWrapper, isOpen && styles.caretWrapperOpen]}>
          <SelectCaretIcon />
        </View>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.list}>
          {appointmentRequests.map(request => (
            <AppointmentRequestCard key={request.id} request={request} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginHorizontal: -32,
    paddingHorizontal: 16,
    borderBottomColor: colors.gray['200'],
    borderBottomWidth: 1,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  caretWrapper: {
    transform: [{ rotate: '0deg' }],
  },
  caretWrapperOpen: {
    transform: [{ rotate: '180deg' }],
  },
  list: {
    gap: 8,
  },
  centered: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
