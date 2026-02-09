import { createStackNavigator } from '@react-navigation/stack';
import { type FC, useMemo } from 'react';

import {
  CompensationsHistoryScreen,
  InsuranceSupportScreen,
} from '@/modules/insurance';
import { MedBotChatScreen } from '@/modules/med-bot';
import { NotificationsScreen } from '@/modules/notifications';
import { AppointmentDetails } from '@/screens/appointment-details';
import { CompensationRequestScreen } from '@/screens/compensation-request';
import { CreateAppointmentScreen } from '@/screens/create-appointment';
import { CreateUserScreen } from '@/screens/create-user';
import { DocumentViewerScreen } from '@/screens/document-viewer';
import { ElectronicReferralsScreen } from '@/screens/electronic-referrals';
import { InsuranceDetailsScreen } from '@/screens/insurance-details';
import { MedicalNetworkScreen } from '@/screens/medical-network';
import { OtpVerificationScreen } from '@/screens/otp-verification';
import { SignInScreen } from '@/screens/sign-in';
import { MedBotTopbar } from '@/shared/components/med-bot-topbar';
import { SecondaryTopbar } from '@/shared/components/secondary-topbar';
import { StatusBarUnderlay } from '@/shared/components/status-bar-underlay';
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
        name={routes.CompensationRequest}
        component={CompensationRequestScreen}
        options={{ header: () => <SecondaryTopbar title="" /> }}
      />
      <RootStack.Screen
        name={routes.CompensationsHistory}
        component={CompensationsHistoryScreen}
        options={{
          header: () => <SecondaryTopbar title="История возмещений" />,
        }}
      />
      <RootStack.Screen
        name={routes.InsuranceDetails}
        component={InsuranceDetailsScreen}
        options={{ header: () => <SecondaryTopbar title="" /> }}
      />
      <RootStack.Screen
        name={routes.MedicalNetwork}
        component={MedicalNetworkScreen}
        options={{
          header: () => <SecondaryTopbar title="Медицинская сеть" />,
        }}
      />
      <RootStack.Screen
        name={routes.ElectronicReferrals}
        component={ElectronicReferralsScreen}
        options={{
          header: () => <SecondaryTopbar title="Электронные направления" />,
        }}
      />
      <RootStack.Screen
        name={routes.DocumentViewer}
        component={DocumentViewerScreen}
        options={{
          header: () => <SecondaryTopbar title="Документ" />,
        }}
      />
      <RootStack.Screen
        name={routes.InsuranceSupport}
        component={InsuranceSupportScreen}
        options={{
          header: () => <SecondaryTopbar title="Поддержка" />,
        }}
      />
      <RootStack.Screen
        name={routes.Notifications}
        component={NotificationsScreen}
        options={{
          header: () => <StatusBarUnderlay />,
        }}
      />
      <RootStack.Screen
        name={routes.AppointmentDetails}
        component={AppointmentDetails}
        options={{
          header: () => <SecondaryTopbar title="Детали записи" />,
        }}
      />
    </RootStack.Navigator>
  );
};
