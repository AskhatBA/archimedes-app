import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createContext,
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import {
  patientApi,
  resolveErrorMessage,
  GetPatientProfileResponse,
  CreatePatientBody,
} from '@/api';
import { ScreenLoader } from '@/shared/components/screen-loader';
import { useAuth } from '@/shared/lib/auth';
import { useToast } from '@/shared/lib/toast';
import { routes, useNavigation } from '@/shared/navigation';

type User = GetPatientProfileResponse['patient'];

interface UserContextProps {
  user?: User & { phone: string };
  loadingUser: boolean;
  updateUserProfile: (userData: User) => void;
}

const initialValues: UserContextProps = {
  user: {} as User & { phone: string },
  loadingUser: false,
  updateUserProfile: () => {},
};

const UserContext = createContext<UserContextProps>(initialValues);

export const UserContextProvider: FC<{ children: ReactNode }> = ({
  children,
}): ReactElement | null => {
  const { isAuthenticated } = useAuth();
  const { resetNavigation } = useNavigation();
  const { showToast } = useToast();

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user', isAuthenticated],
    queryFn: async () => (await patientApi.profileList()).data,
    enabled: isAuthenticated,
  });

  const userProfileMutation = useMutation({
    mutationFn: async (userData: CreatePatientBody) =>
      (await patientApi.profileCreate(userData)).data,
    onSuccess: () => {
      showToast({
        type: 'success',
        message: 'profile.successSaveMessage',
        duration: 5000,
      });
    },
    onError: error => {
      showToast({
        type: 'error',
        message: resolveErrorMessage(error),
        duration: 5000,
      });
    },
  });

  useEffect(() => {
    if (user !== undefined && !user.isProfileComplete) {
      resetNavigation(routes.CreateUser);
    }
  }, [user]);

  const value = useMemo(
    (): UserContextProps => ({
      user: { ...user?.patient, phone: user?.user?.phone },
      loadingUser: loadingUser || userProfileMutation.isPending,
      updateUserProfile: userProfileMutation.mutate,
    }),
    [user, loadingUser, userProfileMutation.isPending],
  );

  if (loadingUser) return <ScreenLoader text="Загружаем ваши данные..." />;

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextProps => {
  const ctx = useContext(UserContext);
  if (!ctx)
    throw new Error('Attempt to use UserContext context outside its scope');
  return ctx;
};
