import { createStackNavigator } from '@react-navigation/stack';
import { type FC } from 'react';

import { CreateAppointmentScreen } from '@/modules/appointment/screens/create-appointment';
import { OtpVerificationScreen } from '@/modules/auth/screens/otp-verification';
import { SignInScreen } from '@/modules/auth/screens/sign-in';
import { MedBotChatScreen } from '@/modules/med-bot/screens/med-bot-chat';
import { MedBotTopbar } from '@/shared/components/med-bot-topbar';
import { SecondaryTopbar } from '@/shared/components/secondary-topbar';
import { routes } from '@/shared/navigation';

import { TabNavigator } from './tab-navigator';

const RootStack = createStackNavigator();

export const RootNavigator: FC = () => {
  return (
    <RootStack.Navigator id={undefined} initialRouteName={routes.SignIn}>
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
    </RootStack.Navigator>
  );
};
