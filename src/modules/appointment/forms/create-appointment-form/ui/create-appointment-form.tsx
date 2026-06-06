import { FC, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useUser } from '@/modules/user';
import { Button } from '@/shared/components/button';
import { SelectField } from '@/shared/components/select-field';
import { TimeSlotPicker } from '@/shared/components/time-slot-picker';
import { useTranslation } from '@/shared/lib/i18n';
import { useFamily, usePrograms } from '@/shared/lib/insurance';
import { colors } from '@/shared/theme';

import { AppointmentTypeSwitch } from '../../../components/appointment-type-switch';
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
  const { user } = useUser();
  const { family } = useFamily(formValues.programId);
  const { t } = useTranslation();

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
      <View style={styles.typeSwitchContainer}>
        <AppointmentTypeSwitch
          appointmentType={
            formValues.isTelemedicine ? 'telemedicine' : 'regular'
          }
          changeAppointmentType={value => {
            changeFormValues('isTelemedicine', value === 'telemedicine');
            changeFormValues('specializationId', undefined);
          }}
        />
      </View>

      <View>
        <Text
          style={[
            createAppointmentFormStyles.title,
            { color: colors.gray['500'] },
          ]}
        >
          {t('appointments:create.selectProgramLabel')}
        </Text>
        <SelectField
          value={formValues.programId || ''}
          onChange={value => changeFormValues('programId', value)}
          placeholder={t('appointments:create.selectProgramPlaceholder')}
          options={(availablePrograms || []).map(p => ({
            value: p.id,
            label: p.title,
            subtitle: p.cardNo,
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
            {t('appointments:create.selectPatientLabel')}
          </Text>
          <SelectField
            value={formValues.patientId || ''}
            onChange={value => changeFormValues('patientId', value)}
            placeholder={t('appointments:create.selectPatientPlaceholder')}
            options={[
              { value: '', label: t('appointments:create.selfPatient') },
              ...family
                .filter(member => member.benId !== user.misPatientId)
                .map(member => ({
                  value: member.benId,
                  label: member.fullName,
                  subtitle: member.cardNo,
                })),
            ]}
          />
        </View>
      )}

      <ChooseBranch />

      {formValues.branchId && (
        <View>
          <Text
            style={[
              createAppointmentFormStyles.title,
              { color: colors.gray['500'] },
            ]}
          >
            {t('appointments:create.selectSpecializationLabel')}
          </Text>
          <SelectField
            value={formValues.specializationId}
            onChange={value => changeFormValues('specializationId', value)}
            placeholder={t(
              'appointments:create.selectSpecializationPlaceholder',
            )}
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
            {t('appointments:create.selectDoctorLabel')}
          </Text>
          <SelectField
            value={formValues.doctorId}
            onChange={value => changeFormValues('doctorId', value)}
            placeholder={t('appointments:create.selectDoctorPlaceholder')}
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
          {t('appointments:create.noSlots')}
        </Text>
      )}

      <Button
        isLoading={isBooking}
        disabled={!isBookingEnabled}
        onPress={bookAppointment}
      >
        {t('appointments:create.submit')}
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
  typeSwitchContainer: {
    marginTop: 24,
  },
});
