import { FC, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';

import { useAppointmentHistory } from '@/modules/profile/hooks/use-appointment-history';
import { formatDate } from '@/shared/adapters/date';
import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { SelectCaretIcon, HistoryIcon, FileTextIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

import { HistoryCard } from '../../history-card';

import type { MISAppointmentHistory } from '@/api/generated/data-contracts';

export const AppointmentHistory: FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MISAppointmentHistory | null>(null);
  const { appointmentHistory } = useAppointmentHistory();
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
          {appointmentHistory?.length > 0 ? (
            appointmentHistory.map(appointment => (
              <HistoryCard
                key={appointment.id}
                color="blue"
                subtitle={appointment.doctor.name}
                name={`${appointment.appointmentTypeDisplay} - ${formatDate(appointment.actualStartTime, 'DD/MM/YYYY')}`}
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
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          >
            <Text style={[styles.drawerTitle, { color: colors.textMain }]}>
              {`${selected.appointmentTypeDisplay ?? 'Прием'} • ${formatDate(selected.actualStartTime, 'DD/MM/YYYY HH:mm')}`}
            </Text>

            {/* Documents section */}
            {hasDocuments ? (
              <View style={{ gap: 8 }}>
                {(selected.documents || []).map(doc => (
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
                  styles.card,
                  { backgroundColor: colors.gray['200'], marginTop: 12 },
                ]}
              >
                <Text style={[styles.cardTitle, { color: colors.textMain }]}>
                  Врач
                </Text>
                {!!selected.doctor.name && (
                  <Text style={[styles.docText, { color: colors.gray['700'] }]}>
                    Имя: {selected.doctor.name}
                  </Text>
                )}
                {!!selected.doctor.specialtyName && (
                  <Text style={[styles.docText, { color: colors.gray['700'] }]}>
                    Специальность: {selected.doctor.specialtyName}
                  </Text>
                )}
                {!!selected.doctor.position && (
                  <Text style={[styles.docText, { color: colors.gray['700'] }]}>
                    Должность: {selected.doctor.position}
                  </Text>
                )}
                {!!selected.doctor.branchName && (
                  <Text style={[styles.docText, { color: colors.gray['700'] }]}>
                    Филиал: {selected.doctor.branchName}
                  </Text>
                )}
                {typeof selected.doctor.appointmentDurationMinutes ===
                  'number' && (
                  <Text style={[styles.docText, { color: colors.gray['700'] }]}>
                    Длительность приема:{' '}
                    {selected.doctor.appointmentDurationMinutes} мин
                  </Text>
                )}
              </View>
            )}
          </ScrollView>
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
});
