import { FC, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useUser } from '@/modules/user';
import { Button } from '@/shared/components/button';
import { SelectField } from '@/shared/components/select-field';
import { SkeletonElement } from '@/shared/components/skeleton-element';
import { TimeSlotPicker } from '@/shared/components/time-slot-picker';
import { SelectCaretIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { useFamily } from '@/shared/lib/insurance';
import { colors, fonts } from '@/shared/theme';

import { AppointmentTypeSwitch } from '../../../components/appointment-type-switch';
import { useCreateAppointment } from '../../../context/create-appointment-context';

import { AppointmentPrice } from './appointment-price';
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
    isPaidVisit,
    availablePrograms,
    loadingPrograms,
    openProgramChoice,
  } = useCreateAppointment();
  const { user } = useUser();
  const { family } = useFamily(formValues.programId);
  const { t } = useTranslation();

  const selectedProgram = availablePrograms.find(
    program => program.id === formValues.programId,
  );

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

      {loadingPrograms && (
        <View>
          <SkeletonElement
            width={180}
            height={22}
            style={styles.programTitleSkeleton}
          />
          <SkeletonElement height={52} borderRadius={14} />
        </View>
      )}

      {/* Patients without a programme have nothing to choose between: their visit is
          always paid, so the card would only state the obvious. */}
      {!loadingPrograms && availablePrograms.length > 0 && (
        <View>
          <Text
            style={[
              createAppointmentFormStyles.title,
              { color: colors.gray['500'] },
            ]}
          >
            {t('appointments:create.selectProgramLabel')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.programCard}
            onPress={openProgramChoice}
          >
            <View style={styles.programCardBody}>
              <Text style={styles.programCardTitle} numberOfLines={2}>
                {selectedProgram
                  ? selectedProgram.title
                  : t('appointments:create.programChoice.paidTitle')}
              </Text>
              <Text style={styles.programCardSubtitle} numberOfLines={1}>
                {selectedProgram
                  ? selectedProgram.cardNo
                  : t('appointments:create.programChoice.paidSubtitle')}
              </Text>
            </View>
            <Text style={styles.programCardAction}>
              {t('appointments:create.programChoice.change')}
            </Text>
            <View style={styles.programCardCaret}>
              <SelectCaretIcon color={colors.blue['400']} />
            </View>
          </TouchableOpacity>
        </View>
      )}

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

      <AppointmentPrice />

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
        {t(
          isPaidVisit
            ? 'appointments:create.submitPaid'
            : 'appointments:create.submit',
        )}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
  programTitleSkeleton: {
    marginBottom: 11,
  },
  programCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.blue['100'],
    borderWidth: 1,
    borderColor: colors.blue['200'],
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  programCardBody: {
    flex: 1,
    gap: 2,
  },
  programCardTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    color: colors.textMain,
  },
  programCardSubtitle: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['500'],
  },
  programCardAction: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    color: colors.blue['400'],
  },
  programCardCaret: {
    transform: [{ rotate: '-90deg' }],
  },
  noSlots: {
    marginVertical: 8,
    textAlign: 'center',
  },
  typeSwitchContainer: {
    marginTop: 24,
  },
});
