import { FC, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAppointmentRequests } from '@/modules/appointment/hooks/use-appointment-requests';
import { SelectCaretIcon } from '@/shared/icons';
import { colors } from '@/shared/theme';

import { AppointmentRequestCard } from './appointment-request-card';

export const AppointmentRequests: FC = () => {
  const { appointmentRequests, isLoading } = useAppointmentRequests();
  const [isOpen, setIsOpen] = useState(true);

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
          Заявки на запись
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
