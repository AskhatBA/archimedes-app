import { createStackNavigator } from '@react-navigation/stack';
import { type FC, useMemo } from 'react';

import { CreateAppointmentScreen } from '@/modules/appointment/screens/create-appointment';
import { CreateUserScreen } from '@/modules/auth/screens/create-user';
import { OtpVerificationScreen } from '@/modules/auth/screens/otp-verification';
import { SignInScreen } from '@/modules/auth/screens/sign-in';
import { MedBotChatScreen } from '@/modules/med-bot/screens/med-bot-chat';
import {
  CompensationScreen,
  CompensationsHistoryScreen,
} from '@/modules/profile/screens/compensation';
import {
  InsuranceDetailsScreen,
  InsuranceCertificateScreen,
} from '@/modules/profile/screens/insurance-details';
import { MedBotTopbar } from '@/shared/components/med-bot-topbar';
import { SecondaryTopbar } from '@/shared/components/secondary-topbar';
import { useAuth } from '@/shared/lib/auth';
import { routes } from '@/shared/navigation';

import { TabNavigator } from './tab-navigator';

const RootStack = createStackNavigator();

export const RootNavigator: FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const initialRoute = useMemo((): string => {
    if (isAuthenticated && !isLoading) {
      return routes.TabNavigation;
    }

    return routes.SignIn;
  }, [isAuthenticated, isLoading]);

  return (
    <RootStack.Navigator id={undefined} initialRouteName={initialRoute}>
      <RootStack.Screen
        name={routes.SignIn}
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name={routes.TabNavigation}
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name={routes.CreateAppointment}
        component={CreateAppointmentScreen}
        options={{ header: () => <SecondaryTopbar title="Запись на прием" /> }}
      />
      <RootStack.Screen
        name={routes.MedBotChat}
        component={MedBotChatScreen}
        options={{ header: () => <MedBotTopbar /> }}
      />
      <RootStack.Screen
        name={routes.OtpVerification}
        component={OtpVerificationScreen}
        options={{ header: () => <SecondaryTopbar title="" /> }}
      />
      <RootStack.Screen
        name={routes.CreateUser}
        component={CreateUserScreen}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name={routes.Compensation}
        component={CompensationScreen}
        options={{ header: () => <SecondaryTopbar title="" /> }}
      />
      <RootStack.Screen
        name={routes.CompensationsHistory}
        component={CompensationsHistoryScreen}
        options={{ header: () => <SecondaryTopbar title="" /> }}
      />
      <RootStack.Screen
        name={routes.InsuranceDetails}
        component={InsuranceDetailsScreen}
        options={{ header: () => <SecondaryTopbar title="" /> }}
      />
      <RootStack.Screen
        name={routes.InsuranceCertificate}
        component={InsuranceCertificateScreen}
        options={{
          header: () => <SecondaryTopbar title="Страховой сертификат" />,
        }}
      />
    </RootStack.Navigator>
  );
};
