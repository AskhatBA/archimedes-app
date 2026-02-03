import { FC, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Button } from '@/shared/components/button';
import { SelectField } from '@/shared/components/select-field';
import { TimeSlotPicker } from '@/shared/components/time-slot-picker';
import { useFamily, usePrograms } from '@/shared/lib/insurance';
import { colors } from '@/shared/theme';

import { useCreateAppointment } from '../../../context/create-appointment-context';

import { ChooseBranch } from './choose-branch';
import { createAppointmentFormStyles } from './styles';

export const CreateAppointmentForm: FC = () => {
  const {
    specializations,
    doctors,
    availableSlots,
    changeFormValues,
    isBookingEnabled,
    bookAppointment,
    isBooking,
    formValues,
  } = useCreateAppointment();
  const { programs } = usePrograms();
  const { family } = useFamily(formValues.programId);

  const availablePrograms = useMemo(
    () => programs?.filter(p => p.status !== 'EXPIRED'),
    [programs],
  );

  useEffect(() => {
    if (availablePrograms?.length === 1) {
      changeFormValues('programId', availablePrograms[0].id);
    }
  }, [availablePrograms]);

  const availableSlotList = useMemo(
    () => Object.values(availableSlots || {}),
    [availableSlots],
  );

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
          value={formValues.programId || ''}
          onChange={value => changeFormValues('programId', value)}
          placeholder="Страховка"
          options={(availablePrograms || []).map(p => ({
            value: p.id,
            label: `${p.title} (${p.cardNo})`,
          }))}
        />
      </View>

      {formValues.programId && family && (
        <View>
          <Text
            style={[
              createAppointmentFormStyles.title,
              { color: colors.gray['500'] },
            ]}
          >
            Выберите пациента
          </Text>
          <SelectField
            value={formValues.patientId || ''}
            onChange={value => changeFormValues('patientId', value)}
            placeholder="Пациент"
            options={[
              { value: '', label: 'Оформить на себя' },
              ...family.map(member => ({
                value: member.benId,
                label: member.fullName,
              })),
            ]}
          />
        </View>
      )}

      {formValues.programId && <ChooseBranch />}

      {formValues.branchId && (
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
            value={formValues.specializationId}
            onChange={value => changeFormValues('specializationId', value)}
            placeholder="Список специализаций"
            options={specializations.map(item => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </View>
      )}

      {formValues.branchId && formValues.specializationId && (
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
            value={formValues.doctorId}
            onChange={value => changeFormValues('doctorId', value)}
            placeholder="Любой врач"
            options={doctors.map(item => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </View>
      )}

      {formValues.doctorId && availableSlotList.length > 0 && (
        <TimeSlotPicker
          onSelect={(selectedDate, selectedTime) => {
            changeFormValues('date', selectedDate);
            changeFormValues('timeSlot', selectedTime);
          }}
          selectedDate={formValues.date}
          selectedTime={formValues.timeSlot}
          days={availableSlotList.map(slot => ({
            ...slot,
            slots: slot.timeSlots.map(item => ({
              time: item.startTime,
              available: true,
            })),
          }))}
        />
      )}
      {formValues.doctorId && availableSlotList.length === 0 && (
        <Text style={[styles.noSlots, { color: colors.gray['500'] }]}>
          Нет доступных слотов для записи
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
