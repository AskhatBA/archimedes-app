import { useQuery } from '@tanstack/react-query';
import {
  createContext,
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { patientApi, GetPatientProfileResponse } from '@/api';
import { ScreenLoader } from '@/shared/components/screen-loader';
import { GET_USER_INFO_QUERY } from '@/shared/constants';
import { useAuth } from '@/shared/lib/auth';
import { routes, useNavigation } from '@/shared/navigation';

type User = GetPatientProfileResponse['patient'];

interface UserContextProps {
  user?: User & { phone: string };
  loadingUser: boolean;
  refreshUserData: () => void;
}

const initialValues: UserContextProps = {
  user: {} as User & { phone: string },
  loadingUser: false,
  refreshUserData: () => {},
};

const UserContext = createContext<UserContextProps>(initialValues);

export const UserContextProvider: FC<{ children: ReactNode }> = ({
  children,
}): ReactElement | null => {
  const { isAuthenticated } = useAuth();
  const { resetNavigation } = useNavigation();

  const {
    data: user,
    isLoading: loadingUser,
    refetch: refreshUserData,
  } = useQuery({
    queryKey: [GET_USER_INFO_QUERY, isAuthenticated],
    queryFn: async () => (await patientApi.profileList()).data,
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (user !== undefined && !user.isProfileComplete) {
      resetNavigation(routes.CreateUser);
    }
  }, [user]);

  const value = useMemo(
    (): UserContextProps => ({
      user: { ...user?.patient, phone: user?.user?.phone },
      loadingUser,
      refreshUserData,
    }),
    [user, loadingUser],
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
