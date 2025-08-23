import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createContext,
  FC,
  ReactElement,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';

import {
  api,
  Doc4UUserResponse,
  UpdateDoc4UUserRequest,
  resolveErrorMessage,
} from '@/api';
import { useAuth } from '@/shared/lib/auth';
import { useToast } from '@/shared/lib/toast';

interface UserContextProps {
  user: Doc4UUserResponse;
  loadingUser: boolean;
  updateUserProfile: (userData: UpdateDoc4UUserRequest) => void;
}

const initialValues: UserContextProps = {
  user: {} as Doc4UUserResponse,
  loadingUser: false,
  updateUserProfile: () => {},
};

const UserContext = createContext<UserContextProps>(initialValues);

export const UserContextProvider: FC<{ children: ReactNode }> = ({
  children,
}): ReactElement | null => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const { t } = useTranslation();

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user', isAuthenticated],
    queryFn: async () => (await api.usersGetCurrentUserCurrentGet()).data,
    enabled: isAuthenticated,
  });

  const userProfileMutation = useMutation({
    mutationFn: async (userData: UpdateDoc4UUserRequest) =>
      (await api.usersUpdateCurrentUserCurrentPatch(userData)).data,
    onSuccess: () => {
      showToast({
        type: 'success',
        message: t('profile.successSaveMessage'),
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

  const value = useMemo(
    (): UserContextProps => ({
      user,
      loadingUser: loadingUser || userProfileMutation.isPending,
      updateUserProfile: userProfileMutation.mutate,
    }),
    [user, loadingUser, userProfileMutation.isPending],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextProps => {
  const ctx = useContext(UserContext);
  if (!ctx)
    throw new Error('Attempt to use UserContext context outside its scope');
  return ctx;
};
