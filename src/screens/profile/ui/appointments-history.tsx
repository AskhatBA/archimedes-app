import { FC, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';

import { useAppointmentsHistory } from '@/modules/appointment';
import { BottomDrawer } from '@/shared/components/bottom-drawer';
import {
  SelectCaretIcon,
  HistoryIcon,
  FileTextIcon,
  UserFilledIcon,
  StethoscopeIcon,
  HospitalIcon,
  ClockIcon,
} from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTheme } from '@/shared/theme';

import { HistoryCard } from './history-card';

import type { MISAppointmentHistory } from '@/api/generated/data-contracts';

export const CONSULTATION_SHEET = 'Консультационный лист';

export const AppointmentHistory: FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MISAppointmentHistory | null>(null);
  const { appointmentsHistory } = useAppointmentsHistory();
  const { colors } = useTheme();

  const headerBg = open ? colors.blue['100'] : colors.gray['200'];
  const headerText = open ? colors.blue['400'] : colors.gray['700'];
  const caretColor = open ? colors.blue['400'] : colors.gray['700'];

  const onOpenAppointment = (appointment: MISAppointmentHistory) => {
    setSelected(appointment);
  };

  const closeDrawer = () => setSelected(null);

  const openUrl = async (url?: string) => {
    if (!url) return;
    const documentUrl = `https://misapi.archimedes.kz/${url}`;
    const supported = await Linking.canOpenURL(documentUrl);
    if (supported) await Linking.openURL(documentUrl);
  };

  const hasDocuments = (selected?.documents || []).length > 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setOpen(prev => !prev)}
        style={[styles.fieldContainer, { backgroundColor: headerBg }]}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <HistoryIcon color={headerText} />
          <Text numberOfLines={1} style={[styles.value, { color: headerText }]}>
            История обращений
          </Text>
        </View>

        <SelectCaretIcon color={caretColor} />
      </TouchableOpacity>
      {open && (
        <View style={[styles.tests]}>
          {appointmentsHistory?.length > 0 ? (
            appointmentsHistory.map(appointment => (
              <HistoryCard
                key={appointment.id}
                color="blue"
                subtitle={appointment.doctor.name}
                name={`${appointment.doctor.specialtyName} - ${formatDate(appointment.actualStartTime || appointment.startTime, 'DD.MM.YYYY')}`}
                onPress={() =>
                  onOpenAppointment(appointment as MISAppointmentHistory)
                }
              />
            ))
          ) : (
            <View
              style={[
                styles.card,
                { backgroundColor: colors.gray['200'], alignItems: 'center' },
              ]}
            >
              <Text style={[styles.cardTitle, { color: colors.gray['600'] }]}>
                Нет записей
              </Text>
            </View>
          )}
        </View>
      )}

      <BottomDrawer visible={!!selected} onClose={closeDrawer}>
        {selected && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            <Text style={[styles.drawerTitle, { color: colors.textMain }]}>
              {`${selected.appointmentTypeDisplay ?? 'Прием'} • ${formatDate(selected.startTime || selected.actualStartTime, 'DD/MM/YYYY HH:mm')}`}
            </Text>

            {/* Documents section */}
            {hasDocuments ? (
              <View style={{ gap: 8 }}>
                {(
                  selected.documents?.filter(
                    doc => doc.documentTypeName === CONSULTATION_SHEET,
                  ) || []
                ).map(doc => (
                  <TouchableOpacity
                    key={doc.id}
                    onPress={() => openUrl(doc.fileUrl)}
                    activeOpacity={0.7}
                    style={[
                      styles.card,
                      { backgroundColor: colors.gray['200'] },
                    ]}
                    accessibilityRole="link"
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <FileTextIcon color={colors.primary} />
                      <Text
                        style={[styles.cardTitle, { color: colors.textMain }]}
                        numberOfLines={2}
                      >
                        {doc.documentTypeName}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={{ color: colors.gray['600'] }}>
                Документы отсутствуют
              </Text>
            )}

            {/* Doctor information */}
            {selected.doctor && (
              <View
                style={[
                  styles.doctorCard,
                  { backgroundColor: colors.blue['100'], marginTop: 12 },
                ]}
              >
                {/* Header: avatar + name + specialty */}
                <View style={styles.doctorHeader}>
                  <View
                    style={[
                      styles.doctorAvatar,
                      { backgroundColor: colors.blue['150'] },
                    ]}
                  >
                    <UserFilledIcon
                      width={22}
                      height={22}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.doctorHeaderText}>
                    {!!selected.doctor.name && (
                      <Text
                        style={[styles.doctorName, { color: colors.textMain }]}
                        numberOfLines={2}
                      >
                        {selected.doctor.name}
                      </Text>
                    )}
                    {!!selected.doctor.specialtyName && (
                      <Text
                        style={[
                          styles.doctorSpecialty,
                          { color: colors.gray['500'] },
                        ]}
                        numberOfLines={1}
                      >
                        {selected.doctor.specialtyName}
                      </Text>
                    )}
                  </View>
                </View>

                {(!!selected.doctor.position ||
                  !!selected.doctor.branchName ||
                  typeof selected.doctor.appointmentDurationMinutes ===
                    'number') && (
                  <View
                    style={[
                      styles.doctorDivider,
                      { backgroundColor: colors.blue['200'] },
                    ]}
                  />
                )}

                <View style={styles.doctorDetails}>
                  {!!selected.doctor.position && (
                    <View style={styles.doctorDetailRow}>
                      <StethoscopeIcon
                        width={16}
                        height={16}
                        color={colors.gray['500']}
                      />
                      <View style={styles.doctorDetailTexts}>
                        <Text
                          style={[
                            styles.doctorDetailLabel,
                            { color: colors.gray['500'] },
                          ]}
                        >
                          Должность
                        </Text>
                        <Text
                          style={[
                            styles.doctorDetailValue,
                            { color: colors.textMain },
                          ]}
                        >
                          {selected.doctor.position}
                        </Text>
                      </View>
                    </View>
                  )}
                  {!!selected.doctor.branchName && (
                    <View style={styles.doctorDetailRow}>
                      <HospitalIcon
                        width={16}
                        height={16}
                        color={colors.gray['500']}
                      />
                      <View style={styles.doctorDetailTexts}>
                        <Text
                          style={[
                            styles.doctorDetailLabel,
                            { color: colors.gray['500'] },
                          ]}
                        >
                          Филиал
                        </Text>
                        <Text
                          style={[
                            styles.doctorDetailValue,
                            { color: colors.textMain },
                          ]}
                        >
                          {selected.doctor.branchName}
                        </Text>
                      </View>
                    </View>
                  )}
                  {typeof selected.doctor.appointmentDurationMinutes ===
                    'number' && (
                    <View style={styles.doctorDetailRow}>
                      <ClockIcon
                        width={16}
                        height={16}
                        color={colors.gray['500']}
                      />
                      <View style={styles.doctorDetailTexts}>
                        <Text
                          style={[
                            styles.doctorDetailLabel,
                            { color: colors.gray['500'] },
                          ]}
                        >
                          Длительность приёма
                        </Text>
                        <Text
                          style={[
                            styles.doctorDetailValue,
                            { color: colors.textMain },
                          ]}
                        >
                          {selected.doctor.appointmentDurationMinutes} мин
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        )}
      </BottomDrawer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    padding: 18,
  },
  value: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 600,
  },
  tests: {
    marginTop: 8,
    gap: 7,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 12,
  },
  card: {
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
  },
  docText: {
    fontSize: 14,
    marginTop: 4,
  },
  doctorCard: {
    borderRadius: 15,
    padding: 14,
    gap: 12,
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doctorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  doctorHeaderText: {
    flex: 1,
    gap: 2,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  doctorSpecialty: {
    fontSize: 13,
    fontWeight: '400',
  },
  doctorDivider: {
    height: 1,
  },
  doctorDetails: {
    gap: 10,
  },
  doctorDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  doctorDetailTexts: {
    flex: 1,
    gap: 1,
  },
  doctorDetailLabel: {
    fontSize: 11,
    fontWeight: '400',
  },
  doctorDetailValue: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
});
