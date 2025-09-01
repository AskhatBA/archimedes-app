import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import {
  createContext,
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  MISSpecialization,
  MISBranch,
  MISDoctor,
  MISAvailableSlots,
  misApi,
} from '@/api';
import { useAvailableSlots } from '@/modules/appointment/hooks/use-available-slots';
import { useDoctors } from '@/modules/appointment/hooks/use-doctors';
import { useSpecializations } from '@/modules/appointment/hooks/use-specializations';
import { formatDate } from '@/shared/adapters/date';
import { BookingSuccessPopup } from '@/shared/components/booking-success-popup';
import { useToast } from '@/shared/lib/toast';
import { useNavigation } from '@/shared/navigation';

interface CreateAppointmentContextProps {
  branch: MISBranch['id'] | undefined;
  specialization: MISSpecialization['id'] | undefined;
  specializations: MISSpecialization[];
  setBranch: (branch: MISBranch['id']) => void;
  setSpecialization: (specialization: MISSpecialization['id']) => void;
  doctor: MISDoctor['id'] | undefined;
  setDoctor: (doctor: MISDoctor['id']) => void;
  doctors: MISDoctor[];
  availableSlots: MISAvailableSlots | undefined;
  selectedDate: string | undefined;
  setSelectedDate: (date: string) => void;
  timeSlot: string | undefined;
  setTimeSlot: (timeSlot: string) => void;
  isBookingEnabled: boolean;
  bookAppointment: () => void;
  isBooking?: boolean;
}

const initialValues: CreateAppointmentContextProps = {
  branch: undefined,
  specialization: undefined,
  specializations: [],
  setBranch: () => {},
  setSpecialization: () => {},
  doctor: undefined,
  setDoctor: () => {},
  doctors: [],
  availableSlots: undefined,
  selectedDate: undefined,
  setSelectedDate: () => {},
  timeSlot: undefined,
  setTimeSlot: () => {},
  isBookingEnabled: false,
  bookAppointment: () => {},
};

const CreateAppointmentContext =
  createContext<CreateAppointmentContextProps>(initialValues);

export const CreateAppointmentContextProvider: FC<{ children: ReactNode }> = ({
  children,
}): ReactElement | null => {
  const { showToast } = useToast();
  const { goBack } = useNavigation();
  const [branch, setBranch] = useState<MISBranch['id']>();
  const [specialization, setSpecialization] =
    useState<MISSpecialization['id']>();
  const [doctor, setDoctor] = useState<MISDoctor['id']>();
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDate(new Date()),
  );
  const [success, setSuccess] = useState(false);
  const [timeSlot, setTimeSlot] = useState<string>();
  const { specializations } = useSpecializations(branch);
  const { doctors } = useDoctors(branch, specialization);
  const { availableSlots } = useAvailableSlots(
    doctor,
    selectedDate,
    selectedDate,
  );
  const doctorDetails = doctors.find(misDoctor => misDoctor.id === doctor);

  const isBookingEnabled =
    !!branch && !!specialization && !!doctor && !!selectedDate && !!timeSlot;

  const resetFormValues = () => {
    setBranch(undefined);
    setSpecialization(undefined);
    setDoctor(undefined);
    setSelectedDate(formatDate(new Date()));
    setTimeSlot(undefined);
  };

  const createAppointmentMutation = useMutation({
    mutationFn: () => {
      const endTime = availableSlots?.[selectedDate]?.timeSlots.find(
        time => time.startTime === timeSlot,
      )?.endTime;

      return misApi.createAppointmentCreate({
        branchId: branch,
        doctorId: doctor,
        startTime: `${selectedDate}T${timeSlot}:00+05:00`,
        endTime: `${selectedDate}T${endTime}:00+05:00`,
      });
    },
    onSuccess: () => {
      setSuccess(true);
    },
    onError: (error: any) => {
      if (error.response?.data?.message) {
        showToast({
          type: 'error',
          message: error.response.data.message,
        });
        return;
      }
      showToast({
        type: 'error',
        message: 'Неизвестная ошибка. Попробуйте еще раз через минуту',
      });
    },
  });

  const bookAppointment = () => {
    createAppointmentMutation.mutate();
  };

  const finishBooking = () => {
    resetFormValues();
    setSuccess(false);
    goBack();
  };

  const value = useMemo(
    (): CreateAppointmentContextProps => ({
      availableSlots,
      specializations,
      branch,
      setBranch,
      specialization,
      setSpecialization,
      doctor,
      setDoctor,
      doctors,
      selectedDate,
      setSelectedDate,
      timeSlot,
      setTimeSlot,
      isBookingEnabled,
      bookAppointment,
      isBooking: createAppointmentMutation.isPending,
    }),
    [
      createAppointmentMutation.isPending,
      availableSlots,
      selectedDate,
      branch,
      doctor,
      specialization,
      specializations,
      doctors,
      timeSlot,
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
          selectedDate && timeSlot
            ? formatDate(
                `${selectedDate}T${timeSlot}:00+05:00`,
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
