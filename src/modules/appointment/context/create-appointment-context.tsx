import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  createContext,
  FC,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  MISSpecialization,
  MISDoctor,
  MISAvailableSlots,
  MedicServiceItem,
  InsuranceProgram,
  misApi,
  paymentApi,
} from '@/api';
import { useAvailableSlots } from '@/modules/appointment/hooks/use-available-slots';
import { useBranches } from '@/modules/appointment/hooks/use-branches';
import { useDoctors } from '@/modules/appointment/hooks/use-doctors';
import { useSpecializations } from '@/modules/appointment/hooks/use-specializations';
import { useTelemedicineOffer } from '@/modules/appointment/hooks/use-telemedicine-offer';
import { useMedicService } from '@/modules/insurance/hooks/use-medic-service';
import { useServicePrice } from '@/modules/insurance/hooks/use-service-price';
import { usePaymentStatus } from '@/modules/payment';
import { BookingSuccessPopup } from '@/shared/components/booking-success-popup';
import { AnalyticsEvents, logAnalyticsEvent } from '@/shared/lib/analytics';
import { formatDate } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { usePrograms } from '@/shared/lib/insurance';
import { useToast } from '@/shared/lib/toast';
import { useNavigation } from '@/shared/navigation';
import { routes } from '@/shared/navigation/routes';

import { ProgramChoiceModal } from '../components/program-choice-modal';
import { PublicOfferDrawer } from '../components/public-offer-drawer';
import { visitPriceOf } from '../lib/visit-price';
import { CreateAppointmentForm, VisitPrice } from '../types';

/** Backend codes the booking form has its own wording for, instead of showing the code. */
const CREATE_ERROR_KEYS: Record<string, string> = {
  MIS_INSURANCE_LIMIT_EXCEEDED: 'appointments:create.errorInsuranceLimitExceeded',
  UNKNOWN_ERROR: 'appointments:create.errorUnknown',
};

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
  /** Programmes the patient may book under — expired ones cover nothing. */
  availablePrograms: InsuranceProgram[];
  loadingPrograms: boolean;
  /** No programme selected — the visit is paid for per booking. */
  isPaidVisit: boolean;
  /** Booked under the `isMedAccount` programme — the visit is paid from the медсчёт. */
  isMedAccountVisit: boolean;
  /**
   * What the price card shows and a paid visit is charged. `null` until it is known, and
   * for a visit under a programme the insurer pays for.
   */
  visitPrice: VisitPrice | null;
  /** Reopens the programme / paid choice so the patient can switch. */
  openProgramChoice: () => void;
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
  availablePrograms: [],
  loadingPrograms: false,
  isPaidVisit: false,
  isMedAccountVisit: false,
  visitPrice: null,
  openProgramChoice: () => {},
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
  /** The full-screen programme / paid choice shown to patients who have a programme. */
  const [isProgramChoiceVisible, setIsProgramChoiceVisible] = useState(false);
  /** Whether the patient has already answered that choice for this booking. */
  const [isProgramChosen, setIsProgramChosen] = useState(false);
  const [formValues, setFormValues] =
    useState<CreateAppointmentForm>(FORM_INITIAL_VALUES);

  const { specializations } = useSpecializations(
    formValues.branchId,
    formValues.isTelemedicine,
  );

  // `patientId` is the relative's `benId` — empty when booking for oneself.
  const { doctors, loadingDoctors } = useDoctors(
    formValues.branchId,
    formValues.specializationId,
    { familyMemberId: formValues.patientId, programId: formValues.programId },
  );

  // The list depends on the patient's age, so picking someone else can take the chosen
  // doctor off it — and their slot with them, or booking would stay enabled for a doctor
  // the patient cannot see.
  useEffect(() => {
    if (loadingDoctors || !formValues.doctorId) return;
    if (doctors.some(doctor => doctor.id === formValues.doctorId)) return;
    setFormValues(prev => ({
      ...prev,
      doctorId: undefined,
      timeSlot: undefined,
    }));
  }, [loadingDoctors, doctors, formValues.doctorId]);

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

  // Telemedicine is one service of its own whichever doctor holds it, so the doctor's
  // in-person service is neither requested nor used for it — not even from the cache.
  const { medicService: doctorService, isLoading: loadingMedicService } =
    useMedicService(
      branchExternalId,
      doctorDetails?.iin,
      !formValues.isTelemedicine,
    );
  const medicService = formValues.isTelemedicine ? null : doctorService;

  const { programs, loadingPrograms } = usePrograms();

  // An expired programme covers nothing, so it cannot be booked under.
  const availablePrograms = useMemo(
    () => (programs || []).filter(program => program.status !== 'EXPIRED'),
    [programs],
  );

  const hasPrograms = availablePrograms.length > 0;

  /**
   * Having a programme no longer forces the visit to be insured: the patient picks a
   * programme or a paid visit up front, and "no programme selected" means paid — the
   * same flow a patient without any programme goes through.
   */
  const isPaidVisit = !loadingPrograms && !formValues.programId;

  /**
   * The medical-account programme is the one programme whose visit still has a price for
   * the patient: it is paid from the медсчёт, at the insurer's med-account price for the
   * doctor's service. Every other programme is paid by the insurer and shows none.
   */
  const isMedAccountVisit = !!availablePrograms.find(
    program => program.id === formValues.programId,
  )?.isMedAccount;

  // A paid in-person visit shows the same med-account discount, so it reads the same
  // price. Telemedicine has a price of its own and no discount.
  const { servicePrice, isLoading: loadingServicePrice } = useServicePrice(
    branchExternalId,
    medicService?.oid,
    !formValues.isTelemedicine && (isPaidVisit || isMedAccountVisit),
  );

  // A paid online consultation and a med-account one show its price; under any other
  // programme the insurer pays for it.
  const isPaidTelemedicine = formValues.isTelemedicine && isPaidVisit;
  const { telemedicineOffer, isError: telemedicineOfferFailed } =
    useTelemedicineOffer(
      formValues.isTelemedicine && (isPaidVisit || isMedAccountVisit),
    );

  // Without the price a paid online consultation cannot be checked out, so the patient is
  // told why the button stays disabled. A med-account one is booked without it.
  useEffect(() => {
    if (!isPaidTelemedicine || !telemedicineOfferFailed) return;
    showToast({
      type: 'error',
      message: t('appointments:create.errorTelemedicineOffer'),
    });
  }, [isPaidTelemedicine, telemedicineOfferFailed, showToast, t]);

  /**
   * One value for the price card and for what a paid visit is charged, so the patient is
   * never charged anything but what they were shown. The rules are in `visitPriceOf`.
   */
  const visitPrice = useMemo(
    (): VisitPrice | null =>
      visitPriceOf({
        isTelemedicine: formValues.isTelemedicine,
        isPaidVisit,
        isMedAccountVisit,
        telemedicineOffer,
        medicService,
        servicePrice,
        loadingServicePrice,
      }),
    [
      formValues.isTelemedicine,
      isPaidVisit,
      isMedAccountVisit,
      telemedicineOffer,
      medicService,
      servicePrice,
      loadingServicePrice,
    ],
  );

  // A patient with programmes answers the choice before touching the form; one without
  // has nothing to choose, so their visit is paid from the start.
  useEffect(() => {
    if (loadingPrograms || isProgramChosen || !hasPrograms) return;
    setIsProgramChoiceVisible(true);
  }, [loadingPrograms, isProgramChosen, hasPrograms]);

  const chooseProgram = (programId?: string) => {
    // The patient list belongs to the previous programme — a paid visit has none at all.
    setFormValues(prev => ({ ...prev, programId, patientId: undefined }));
    setIsProgramChosen(true);
    setIsProgramChoiceVisible(false);
  };

  const openProgramChoice = () => setIsProgramChoiceVisible(true);

  // Dismissing the choice before answering it leaves nothing to book under, so the
  // screen steps back instead of dropping the patient onto a half-configured form.
  const closeProgramChoice = () => {
    setIsProgramChoiceVisible(false);
    if (!isProgramChosen) goBack();
  };

  const isBookingEnabled =
    !!formValues.branchId &&
    !!formValues.specializationId &&
    !!formValues.doctorId &&
    !!formValues.timeSlot &&
    (!hasPrograms || isProgramChosen) &&
    // A paid visit cannot be sent to checkout before the price is known — including
    // whether the discount applies, or the patient would be charged the full price.
    (!isPaidVisit || !!visitPrice);

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
        // Telemedicine is booked under the clinic's own service code, set by the backend.
        ...(!payload.isTelemedicine && medicService
          ? { medicServiceOid: medicService.oid }
          : {}),
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
      const key = CREATE_ERROR_KEYS[error.response?.data?.message ?? ''];
      if (key) {
        showToast({ type: 'error', message: t(key) });
        return;
      }
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
      // An in-person visit also needs the doctor's service, whose `oid` MIS books it under;
      // telemedicine is booked under the backend's own code and needs only its price.
      if (!visitPrice || (!payload.isTelemedicine && !medicService)) {
        throw new Error('Missing appointment price');
      }

      const { startTime, endTime } = slotTimesOf(payload);

      const { data } = await paymentApi.initCreate({
        amount: visitPrice.discountedPrice ?? visitPrice.price,
        description: visitPrice.serviceName,
        purpose: 'APPOINTMENT',
        metadata: {
          doctorId: payload.doctorId,
          branchId: payload.branchId,
          startTime,
          endTime,
          isTelemedicine: !!payload.isTelemedicine,
          ...(payload.patientId ? { familyMemberId: payload.patientId } : {}),
          ...(!payload.isTelemedicine && medicService
            ? { medicServiceOid: medicService.oid }
            : {}),
          // Display-only: MIS knows nothing about this visit until the payment settles,
          // so the app carries what it needs to describe it in the meantime.
          doctorName: doctorDetails?.name,
          branchName: selectedBranch?.name,
          branchAddress: selectedBranch?.address,
          serviceName: visitPrice.serviceName,
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
    if (isPaidVisit) {
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
      availablePrograms,
      loadingPrograms,
      isPaidVisit,
      isMedAccountVisit,
      visitPrice,
      openProgramChoice,
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
      availablePrograms,
      loadingPrograms,
      isPaidVisit,
      isMedAccountVisit,
      visitPrice,
      isBookingEnabled,
    ],
  );

  return (
    <CreateAppointmentContext.Provider value={value}>
      {children}
      <ProgramChoiceModal
        visible={isProgramChoiceVisible}
        programs={availablePrograms}
        selectedProgramId={formValues.programId}
        hasChosen={isProgramChosen}
        onSelect={chooseProgram}
        onClose={closeProgramChoice}
      />
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
