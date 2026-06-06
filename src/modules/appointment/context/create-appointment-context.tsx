import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  createContext,
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';

import { MISSpecialization, MISDoctor, MISAvailableSlots, misApi } from '@/api';
import { useAvailableSlots } from '@/modules/appointment/hooks/use-available-slots';
import { useDoctors } from '@/modules/appointment/hooks/use-doctors';
import { useSpecializations } from '@/modules/appointment/hooks/use-specializations';
import { BookingSuccessPopup } from '@/shared/components/booking-success-popup';
import { AnalyticsEvents, logAnalyticsEvent } from '@/shared/lib/analytics';
import { formatDate } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { useToast } from '@/shared/lib/toast';
import { useNavigation } from '@/shared/navigation';

import { CreateAppointmentForm } from '../types';

const FORM_INITIAL_VALUES: CreateAppointmentForm = {
  date: formatDate(new Date()),
  isTelemedicine: false,
};

interface CreateAppointmentContextProps {
  formValues: CreateAppointmentForm;
  changeFormValues: (key: keyof CreateAppointmentForm, value: any) => void;
  specializations: MISSpecialization[];
  doctors: MISDoctor[];
  availableSlots: MISAvailableSlots | undefined;
  isBookingEnabled: boolean;
  bookAppointment: () => void;
  isBooking?: boolean;
}

const initialValues: CreateAppointmentContextProps = {
  formValues: FORM_INITIAL_VALUES,
  changeFormValues: () => {},
  specializations: [],
  doctors: [],
  availableSlots: undefined,
  isBookingEnabled: false,
  bookAppointment: () => {},
};

const CreateAppointmentContext =
  createContext<CreateAppointmentContextProps>(initialValues);

export const CreateAppointmentContextProvider: FC<{ children: ReactNode }> = ({
  children,
}): ReactElement | null => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { goBack } = useNavigation();
  const { t } = useTranslation();

  const [success, setSuccess] = useState(false);
  const [formValues, setFormValues] =
    useState<CreateAppointmentForm>(FORM_INITIAL_VALUES);

  const { specializations } = useSpecializations(
    formValues.branchId,
    formValues.isTelemedicine,
  );

  const { doctors } = useDoctors(
    formValues.branchId,
    formValues.specializationId,
  );

  const { availableSlots } = useAvailableSlots(
    formValues.doctorId,
    formValues.branchId,
  );

  const doctorDetails = doctors.find(
    misDoctor => misDoctor.id === formValues.doctorId,
  );

  const isBookingEnabled =
    !!formValues.branchId &&
    !!formValues.specializationId &&
    !!formValues.doctorId &&
    !!formValues.doctorId &&
    !!formValues.timeSlot;

  const resetFormValues = () => {
    setFormValues(FORM_INITIAL_VALUES);
  };

  const changeFormValues = (key: keyof CreateAppointmentForm, value: any) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const createAppointmentMutation = useMutation({
    mutationFn: (payload: CreateAppointmentForm) => {
      const endTime = availableSlots?.[payload.date]?.timeSlots.find(
        time => time.startTime === payload.timeSlot,
      )?.endTime;

      return misApi.createAppointmentCreate({
        patientId: payload.patientId,
        branchId: payload.branchId,
        doctorId: payload.doctorId,
        startTime: `${payload.date}T${payload.timeSlot}:00+05:00`,
        endTime: `${payload.date}T${endTime}:00+05:00`,
        insuranceProgramId: payload.programId,
        isTelemedicine: payload.isTelemedicine,
      });
    },
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['appointments-history'] }),
        queryClient.invalidateQueries({ queryKey: ['appointment-requests'] }),
      ]);
      logAnalyticsEvent(AnalyticsEvents.AppointmentCreated, {
        branch_id: variables.branchId,
        specialization_id: variables.specializationId,
        doctor_id: variables.doctorId,
        program_id: variables.programId,
        is_telemedicine: variables.isTelemedicine,
      });
      setSuccess(true);
    },
    onError: (error: any) => {
      if (error.response?.data?.message) {
        console.log('error.response.data.message', error.response.data.message);
        showToast({
          type: 'error',
          message: error.response.data.message,
        });
        return;
      }
      showToast({
        type: 'error',
        message: t('appointments:create.errorUnknown'),
      });
    },
  });

  const bookAppointment = () => {
    if (formValues.date && formValues.timeSlot) {
      const slotDateTime = dayjs(`${formValues.date}T${formValues.timeSlot}`);
      if (!slotDateTime.isAfter(dayjs().add(1, 'hour'))) {
        showToast({
          type: 'error',
          message: t('appointments:create.errorTooLate'),
        });
        return;
      }
    }
    createAppointmentMutation.mutate(formValues);
  };

  const finishBooking = () => {
    resetFormValues();
    setSuccess(false);
    goBack();
  };

  const value = useMemo(
    (): CreateAppointmentContextProps => ({
      formValues,
      changeFormValues,
      availableSlots,
      specializations,
      doctors,
      isBookingEnabled,
      bookAppointment,
      isBooking: createAppointmentMutation.isPending,
    }),
    [
      formValues,
      createAppointmentMutation.isPending,
      availableSlots,
      specializations,
      doctors,
      isBookingEnabled,
    ],
  );

  return (
    <CreateAppointmentContext.Provider value={value}>
      {children}
      <BookingSuccessPopup
        isOpen={success}
        onClose={finishBooking}
        doctorName={doctorDetails?.name}
        appointmentDate={
          formValues.date && formValues.timeSlot
            ? formatDate(
                `${formValues.date}T${formValues.timeSlot}:00+05:00`,
                'DD MMMM YYYY, HH:mm',
              )
            : undefined
        }
      />
    </CreateAppointmentContext.Provider>
  );
};

export const useCreateAppointment = (): CreateAppointmentContextProps => {
  const ctx = useContext(CreateAppointmentContext);
  if (!ctx)
    throw new Error(
      'Attempt to use CreateAppointmentContext context outside its scope',
    );
  return ctx;
};
