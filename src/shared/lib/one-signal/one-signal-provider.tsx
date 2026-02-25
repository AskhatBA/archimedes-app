import { useMutation } from '@tanstack/react-query';
import { type ReactNode, useEffect } from 'react';
import { Platform } from 'react-native';
import { OneSignal, LogLevel } from 'react-native-onesignal';

import { notificationsApi } from '@/api';
import { useAuth } from '@/shared/lib/auth';

const ONE_SIGNAL_APP_ID = '657eca16-0dda-4d03-8bb4-fbd749ba7204';

export const OneSignalProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize(ONE_SIGNAL_APP_ID);
  OneSignal.Notifications.requestPermission(false);

  const deviceCreateMutation = useMutation({
    mutationFn: (subscriptionId: string) =>
      notificationsApi.devicesCreate({
        deviceId: subscriptionId,
        platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
      }),
  });

  const saveOneSignalDeviceId = async () => {
    try {
      const subscriptionId = await OneSignal.User.pushSubscription.getIdAsync();
      if (subscriptionId) {
        await deviceCreateMutation.mutateAsync(subscriptionId);
        return subscriptionId;
      }
      console.log('Subscription ID not available yet.');
      // This might happen if called too early or if permissions are not granted (iOS)
      return null;
    } catch (e) {
      console.error('Error getting OneSignal Subscription ID:', e);
      return null;
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    saveOneSignalDeviceId();
  }, [isAuthenticated]);

  return children;
};
