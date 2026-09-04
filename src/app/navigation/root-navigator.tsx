import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { type FC, useMemo } from 'react';

import { AppLockScreen } from '@/screens/app-lock';
import { AppointmentDetailsScreen } from '@/screens/appointment-details';
import { AppointmentHistoryScreen } from '@/screens/appointment-history';
import { BiometricSetupScreen } from '@/screens/biometric-setup';
import { CompensationRequestScreen } from '@/screens/compensation-request';
import { CreateAppointmentScreen } from '@/screens/create-appointment';
import { CreateUserScreen } from '@/screens/create-user';
import { DocumentViewerScreen } from '@/screens/document-viewer';
import { ElectronicReferralsScreen } from '@/screens/electronic-referrals';
import { MedbotChatScreen } from '@/screens/medbot-chat';
import { MedicalNetworkScreen } from '@/screens/medical-network';
import { NewsDetailsScreen } from '@/screens/news-details';
import { NotificationsScreen } from '@/screens/notifications';
import { OtpVerificationScreen } from '@/screens/otp-verification';
import { PaidProgramsScreen } from '@/screens/paid-programs';
import { PaidProgramsHistoryScreen } from '@/screens/paid-programs-history';
import { PaymentScreen } from '@/screens/payment';
import { PriceListScreen } from '@/screens/price-list';
import { ProgramDetailsScreen } from '@/screens/program-details';
import { ProgramSupportScreen } from '@/screens/program-support';
import { ProgramsScreen } from '@/screens/programs';
import { QrReferralsScreen } from '@/screens/qr-referrals';
import { QrScannerScreen } from '@/screens/qr-scanner';
import { RegisterScreen } from '@/screens/register';
import { RegisterProfileScreen } from '@/screens/register-profile';
import { SessionHistoryScreen } from '@/screens/session-history';
import { SetPinScreen } from '@/screens/set-pin';
import { SignInScreen } from '@/screens/sign-in';
import { MedBotTopbar } from '@/shared/components/med-bot-topbar';
import { NewVersionDrawer } from '@/shared/components/new-version-drawer';
import { SecondaryTopbar } from '@/shared/components/secondary-topbar';
import { StatusBarUnderlay } from '@/shared/components/status-bar-underlay';
import { useAuth } from '@/shared/lib/auth';
import { useTranslation } from '@/shared/lib/i18n';
import { useNewVersionDrawer } from '@/shared/lib/version';
import { routes } from '@/shared/navigation';

import { TabNavigator } from './tab-navigator';

const RootStack = createStackNavigator();

export const RootNavigator: FC = () => {
  const { isAuthenticated, isLoading, isLocked } = useAuth();
  const newVersion = useNewVersionDrawer();
  const { t } = useTranslation();

  const initialRoute = useMemo((): string => {
    if (isAuthenticated && !isLoading) {
      return routes.TabNavigation;
    }

    return routes.SignIn;
  }, [isAuthenticated, isLoading]);

  return (
    <>
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
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.MedbotChat}
          component={MedbotChatScreen}
          options={{ header: () => <MedBotTopbar /> }}
        />
        <RootStack.Screen
          name={routes.Register}
          component={RegisterScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.RegisterProfile}
          component={RegisterProfileScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.OtpVerification}
          component={OtpVerificationScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.CreateUser}
          component={CreateUserScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name={routes.SetPin}
          component={SetPinScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.BiometricSetup}
          component={BiometricSetupScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name={routes.CompensationRequest}
          component={CompensationRequestScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.Programs}
          component={ProgramsScreen}
          options={{
            header: () => <SecondaryTopbar title={t('tabs:programs')} />,
          }}
        />
        <RootStack.Screen
          name={routes.ProgramDetails}
          component={ProgramDetailsScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.MedicalNetwork}
          component={MedicalNetworkScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.ElectronicReferrals}
          component={ElectronicReferralsScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.QrScanner}
          component={QrScannerScreen}
          options={{
            headerShown: false,
            ...TransitionPresets.ModalSlideFromBottomIOS,
          }}
        />
        <RootStack.Screen
          name={routes.QrReferrals}
          component={QrReferralsScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.DocumentViewer}
          component={DocumentViewerScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.ProgramSupport}
          component={ProgramSupportScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.Notifications}
          component={NotificationsScreen}
          options={{ header: () => <StatusBarUnderlay /> }}
        />
        <RootStack.Screen
          name={routes.AppointmentDetails}
          component={AppointmentDetailsScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.AppointmentHistory}
          component={AppointmentHistoryScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.NewsDetails}
          component={NewsDetailsScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.SessionHistory}
          component={SessionHistoryScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.PriceList}
          component={PriceListScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.PaidPrograms}
          component={PaidProgramsScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.PaidProgramsHistory}
          component={PaidProgramsHistoryScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
        <RootStack.Screen
          name={routes.Payment}
          component={PaymentScreen}
          options={{ header: () => <SecondaryTopbar /> }}
        />
      </RootStack.Navigator>
      <NewVersionDrawer
        visible={newVersion.visible}
        onClose={newVersion.onClose}
        onUpdate={newVersion.onUpdate}
        latestVersion={newVersion.latestVersion}
      />
      {isAuthenticated && isLocked && <AppLockScreen />}
    </>
  );
};
