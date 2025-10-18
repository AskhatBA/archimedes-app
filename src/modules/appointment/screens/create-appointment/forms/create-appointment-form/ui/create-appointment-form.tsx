import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useCreateAppointment } from '@/modules/appointment/screens/create-appointment/context/create-appointment-context';
import { Button } from '@/shared/components/button';
import { Calendar } from '@/shared/components/calendar';
import { SelectField } from '@/shared/components/select-field';
import { usePrograms } from '@/shared/lib/insurance';
import { colors } from '@/shared/theme';

import { ChooseBranch } from './choose-branch';
import { createAppointmentFormStyles } from './styles';

export const CreateAppointmentForm: FC = () => {
  const {
    programId,
    setProgramId,
    branch,
    specializations,
    setSpecialization,
    doctor,
    setDoctor,
    specialization,
    doctors,
    availableSlots,
    selectedDate,
    setSelectedDate,
    timeSlot,
    setTimeSlot,
    isBookingEnabled,
    bookAppointment,
    isBooking,
  } = useCreateAppointment();
  const { programs } = usePrograms();

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 24 }}>
        <Text
          style={[
            createAppointmentFormStyles.title,
            { color: colors.gray['500'] },
          ]}
        >
          Выберите страховку
        </Text>
        <SelectField
          value={programId || ''}
          onChange={setProgramId}
          placeholder="Страховка"
          options={(programs || [])
            .filter(p => p.status !== 'EXPIRED')
            .map(p => ({ value: p.id, label: `${p.title} (${p.cardNo})` }))}
        />
      </View>
      <ChooseBranch />
      {branch && (
        <View>
          <Text
            style={[
              createAppointmentFormStyles.title,
              { color: colors.gray['500'] },
            ]}
          >
            Выберите специализацию
          </Text>
          <SelectField
            value={specialization}
            onChange={setSpecialization}
            placeholder="Список специализаций"
            options={specializations.map(item => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </View>
      )}

      {branch && specialization && (
        <View>
          <Text
            style={[
              createAppointmentFormStyles.title,
              { color: colors.gray['500'] },
            ]}
          >
            Выберите врача
          </Text>
          <SelectField
            value={doctor}
            onChange={setDoctor}
            placeholder="Любой врач"
            options={doctors.map(item => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </View>
      )}

      {branch && specialization && doctor && (
        <View>
          <Text
            style={[
              createAppointmentFormStyles.title,
              { color: colors.gray['500'] },
            ]}
          >
            Выберите дату
          </Text>
          <Calendar
            value={selectedDate}
            onChange={value => {
              setTimeSlot('');
              setSelectedDate(value);
            }}
          />
        </View>
      )}

      {availableSlots && availableSlots[selectedDate] ? (
        <View>
          <Text
            style={[
              createAppointmentFormStyles.title,
              { color: colors.gray['500'] },
            ]}
          >
            Доступное время
          </Text>
          <SelectField
            value={timeSlot}
            onChange={setTimeSlot}
            placeholder="Выберите время"
            options={availableSlots[selectedDate].timeSlots.map(item => ({
              value: item.startTime,
              label: item.startTime,
            }))}
          />
        </View>
      ) : (
        <Text style={[styles.noSlots, { color: colors.textMain }]}>
          Нет доступных слотов
        </Text>
      )}

      <Button
        isLoading={isBooking}
        disabled={!isBookingEnabled}
        onPress={bookAppointment}
      >
        Записаться на прием
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
  noSlots: {
    marginVertical: 8,
    textAlign: 'center',
  },
});
