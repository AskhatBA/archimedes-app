import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { TimeSlots } from '@/modules/appointment/components/time-slots';
import { useCreateAppointment } from '@/modules/appointment/screens/create-appointment/context/create-appointment-context';
import { Button } from '@/shared/components/button';
import { Calendar } from '@/shared/components/calendar';
import { SelectField } from '@/shared/components/select-field';
import { useFamily, usePrograms } from '@/shared/lib/insurance';
import { colors } from '@/shared/theme';

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
          options={(programs || [])
            .filter(p => p.status !== 'EXPIRED')
            .map(p => ({ value: p.id, label: `${p.title} (${p.cardNo})` }))}
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
                value: member.id,
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

      {formValues.branchId &&
        formValues.specializationId &&
        formValues.doctorId && (
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
              value={formValues.date}
              onChange={value => {
                changeFormValues('timeSlot', '');
                changeFormValues('date', value);
              }}
            />
          </View>
        )}

      {availableSlots && availableSlots[formValues.date] ? (
        <View>
          <Text
            style={[
              createAppointmentFormStyles.title,
              { color: colors.gray['500'] },
            ]}
          >
            Выберите время
          </Text>
          <TimeSlots
            value={formValues.timeSlot}
            onChange={value => changeFormValues('timeSlot', value)}
            slots={availableSlots[formValues.date].timeSlots.map(
              item => item.startTime,
            )}
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
