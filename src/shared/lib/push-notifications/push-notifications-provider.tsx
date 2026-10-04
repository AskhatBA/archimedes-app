import { getApp } from '@react-native-firebase/app';
import {
  AuthorizationStatus,
  deleteToken,
  getMessaging,
  getToken,
  onMessage,
  onTokenRefresh,
  requestPermission,
} from '@react-native-firebase/messaging';
import { useMutation } from '@tanstack/react-query';
import { type ReactNode, useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

import { notificationsApi } from '@/api';
import { useAuth } from '@/shared/lib/auth';
import { useToast } from '@/shared/lib/toast';

const warn = (message: string, error: unknown) => {
  // eslint-disable-next-line no-console
  console.warn(`[push] ${message}`, error);
};

const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    // Below Android 13 notifications need no runtime permission.
    if (Platform.Version < 33) return true;
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }

  const status = await requestPermission(getMessaging(getApp()));
  return (
    status === AuthorizationStatus.AUTHORIZED ||
    status === AuthorizationStatus.PROVISIONAL
  );
};

export const PushNotificationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const wasAuthenticated = useRef(false);

  const deviceCreateMutation = useMutation({
    mutationFn: (token: string) =>
      notificationsApi.devicesCreate({
        deviceId: token,
        platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
      }),
  });

  useEffect(() => {
    if (!isAuthenticated) {
      // Signing out drops the FCM token, so the backend's next push to it fails as
      // unregistered and the row is cleaned up there — reminders about the previous
      // account's visits never land on a phone someone else signs in on. Skipped on
      // the initial unauthenticated render: there is nothing to drop yet.
      if (wasAuthenticated.current) {
        deleteToken(getMessaging(getApp())).catch(error =>
          warn('Failed to delete FCM token', error),
        );
      }
      wasAuthenticated.current = false;
      return undefined;
    }
    wasAuthenticated.current = true;

    const messaging = getMessaging(getApp());

    const register = async () => {
      try {
        if (!(await requestNotificationPermission())) return;
        const token = await getToken(messaging);
        await deviceCreateMutation.mutateAsync(token);
      } catch (error) {
        warn('Failed to register for push notifications', error);
      }
    };
    register();

    const unsubscribeTokenRefresh = onTokenRefresh(messaging, token => {
      deviceCreateMutation
        .mutateAsync(token)
        .catch(error => warn('Failed to register refreshed FCM token', error));
    });

    // iOS shows a push that arrives in the foreground by itself
    // (`messaging_ios_foreground_presentation_options` in firebase.json); Android does
    // not, so there it is surfaced as a toast instead of being dropped.
    const unsubscribeMessage =
      Platform.OS === 'android'
        ? onMessage(messaging, message => {
            const { title, body } = message.notification ?? {};
            const text = [title, body].filter(Boolean).join('\n');
            if (text) showToast({ type: 'info', message: text });
          })
        : undefined;

    return () => {
      unsubscribeTokenRefresh();
      unsubscribeMessage?.();
    };
  }, [isAuthenticated]);

  return children;
};
