import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  createContext,
  FC,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import {
  MISSpecialization,
  MISDoctor,
  MISAvailableSlots,
  MedicServiceItem,
  misApi,
  paymentApi,
} from '@/api';
import { useAvailableSlots } from '@/modules/appointment/hooks/use-available-slots';
import { useBranches } from '@/modules/appointment/hooks/use-branches';
import { useDoctors } from '@/modules/appointment/hooks/use-doctors';
import { useSpecializations } from '@/modules/appointment/hooks/use-specializations';
import { useMedicService } from '@/modules/insurance/hooks/use-medic-service';
import { usePaymentStatus } from '@/modules/payment';
import { BookingSuccessPopup } from '@/shared/components/booking-success-popup';
import { AnalyticsEvents, logAnalyticsEvent } from '@/shared/lib/analytics';
import { formatDate } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { usePrograms } from '@/shared/lib/insurance';
import { useToast } from '@/shared/lib/toast';
import { useNavigation } from '@/shared/navigation';
import { routes } from '@/shared/navigation/routes';

import { PublicOfferDrawer } from '../components/public-offer-drawer';
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
  medicService: MedicServiceItem | null;
  loadingMedicService: boolean;
  /** No active insurance programme — the visit is paid for per booking. */
  isPaidPatient: boolean;
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
  medicService: null,
  loadingMedicService: false,
  isPaidPatient: false,
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
  const { goBack, navigate } = useNavigation();
  const { t } = useTranslation();

  const [success, setSuccess] = useState(false);
  /** Payment a paid patient is currently completing, watched until it settles. */
  const [pendingPaymentId, setPendingPaymentId] = useState<string | null>(null);
  /** The public offer a paid patient has to accept before checkout. */
  const [isOfferVisible, setIsOfferVisible] = useState(false);
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

  const { branches } = useBranches();

  const selectedBranch = branches?.find(
    branch => branch.id === formValues.branchId,
  );

  const branchExternalId = selectedBranch?.externalId;

  const { medicService, isLoading: loadingMedicService } = useMedicService(
    branchExternalId,
    doctorDetails?.iin,
  );

  const { programs, loadingPrograms } = usePrograms();

  // An expired programme covers nothing, so it does not make the visit insured.
  const isPaidPatient =
    !loadingPrograms &&
    !(programs || []).some(program => program.status !== 'EXPIRED');

  const isBookingEnabled =
    !!formValues.branchId &&
    !!formValues.specializationId &&
    !!formValues.doctorId &&
    !!formValues.doctorId &&
    !!formValues.timeSlot &&
    // A paid patient cannot be sent to checkout before the price is known.
    (!isPaidPatient || !!medicService);

  const resetFormValues = () => {
    setFormValues(FORM_INITIAL_VALUES);
  };

  const changeFormValues = (key: keyof CreateAppointmentForm, value: any) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  /** Slot boundaries in the format MIS expects, shared by the insured and paid flows. */
  const slotTimesOf = (payload: CreateAppointmentForm) => {
    const endTime = availableSlots?.[payload.date]?.timeSlots.find(
      time => time.startTime === payload.timeSlot,
    )?.endTime;

    return {
      startTime: `${payload.date}T${payload.timeSlot}:00+05:00`,
      endTime: `${payload.date}T${endTime}:00+05:00`,
    };
  };

  const createAppointmentMutation = useMutation({
    mutationFn: (payload: CreateAppointmentForm) => {
      const { startTime, endTime } = slotTimesOf(payload);

      return misApi.createAppointmentCreate({
        patientId: payload.patientId,
        branchId: payload.branchId,
        doctorId: payload.doctorId,
        startTime,
        endTime,
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

  /**
   * Starts checkout for a patient without a programme.
   *
   * The appointment is *not* created here: the slot travels to the backend as the
   * payment's metadata, and the visit is booked server-side the moment the payment
   * settles as SUCCESS — from the provider callback or from the background
   * reconciliation sweep, so it happens even if the app is closed on the payment page.
   */
  const initAppointmentPaymentMutation = useMutation({
    mutationFn: async (payload: CreateAppointmentForm) => {
      if (!medicService) {
        throw new Error('Missing appointment price');
      }

      const { startTime, endTime } = slotTimesOf(payload);

      const { data } = await paymentApi.initCreate({
        amount: medicService.price,
        description: medicService.service,
        purpose: 'APPOINTMENT',
        metadata: {
          doctorId: payload.doctorId,
          branchId: payload.branchId,
          startTime,
          endTime,
          isTelemedicine: !!payload.isTelemedicine,
          ...(payload.patientId ? { familyMemberId: payload.patientId } : {}),
          // Display-only: MIS knows nothing about this visit until the payment settles,
          // so the app carries what it needs to describe it in the meantime.
          doctorName: doctorDetails?.name,
          branchName: selectedBranch?.name,
          branchAddress: selectedBranch?.address,
          serviceName: medicService.service,
        },
      });

      return data;
    },
    onSuccess: data => {
      if (!data?.paymentUrl) {
        showToast({
          type: 'error',
          message: t('appointments:create.errorPaymentInit'),
        });
        return;
      }

      setPendingPaymentId(data.paymentId);
      navigate(routes.Payment, {
        paymentUrl: data.paymentUrl,
        // Lets the payment screen offer to drop this payment instead of stranding the
        // patient with a booking that can never be completed or cleared.
        paymentId: data.paymentId,
      });
    },
    onError: (error: unknown) => {
      // The backend refuses a payment it could not fulfil (a conflicting slot, say) and
      // says why — that reason is far more useful than a generic failure.
      const reason = (
        error as { response?: { data?: { message?: string } } } | undefined
      )?.response?.data?.message;

      showToast({
        type: 'error',
        message: reason || t('appointments:create.errorPaymentInit'),
      });
    },
  });

  // Watches the payment the same way any other flow would; the booking itself already
  // happened on the backend by the time this reports SUCCESS.
  usePaymentStatus(pendingPaymentId, {
    onSuccess: useCallback(
      async payment => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['appointments-history'] }),
          queryClient.invalidateQueries({ queryKey: ['appointment-requests'] }),
          // Drops the "waiting for payment" card now that the booking is real.
          queryClient.invalidateQueries({ queryKey: ['payment', 'pending'] }),
        ]);

        // Paid, but the booking itself failed on the backend. Rare — the slot is checked
        // before checkout — but the money is gone, so it must not look like success.
        if (payment.postSuccessError) {
          setPendingPaymentId(null);
          showToast({
            type: 'error',
            message: payment.postSuccessError,
          });
          return;
        }

        logAnalyticsEvent(AnalyticsEvents.AppointmentCreated, {
          branch_id: formValues.branchId,
          specialization_id: formValues.specializationId,
          doctor_id: formValues.doctorId,
          program_id: formValues.programId,
          is_telemedicine: formValues.isTelemedicine,
          paid: true,
        });
        setSuccess(true);
      },
      [queryClient, formValues, showToast],
    ),
    onFailure: useCallback(() => {
      setPendingPaymentId(null);
      queryClient.invalidateQueries({ queryKey: ['payment', 'pending'] });
      showToast({
        type: 'error',
        message: t('appointments:create.errorPaymentFailed'),
      });
    }, [queryClient, showToast, t]),
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

    // A paid visit is charged, so the patient accepts the public offer first; checkout
    // starts from the drawer. An insured visit is covered by the programme's own terms.
    if (isPaidPatient) {
      setIsOfferVisible(true);
      return;
    }

    createAppointmentMutation.mutate(formValues);
  };

  const acceptOfferAndPay = () => {
    setIsOfferVisible(false);
    initAppointmentPaymentMutation.mutate(formValues);
  };

  const finishBooking = () => {
    resetFormValues();
    setPendingPaymentId(null);
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
      medicService,
      loadingMedicService,
      isPaidPatient,
      isBookingEnabled,
      bookAppointment,
      isBooking:
        createAppointmentMutation.isPending ||
        initAppointmentPaymentMutation.isPending,
    }),
    [
      formValues,
      createAppointmentMutation.isPending,
      initAppointmentPaymentMutation.isPending,
      availableSlots,
      specializations,
      doctors,
      medicService,
      loadingMedicService,
      isPaidPatient,
      isBookingEnabled,
    ],
  );

  return (
    <CreateAppointmentContext.Provider value={value}>
      {children}
      <PublicOfferDrawer
        visible={isOfferVisible}
        onClose={() => setIsOfferVisible(false)}
        onAccept={acceptOfferAndPay}
        isSubmitting={initAppointmentPaymentMutation.isPending}
      />
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
