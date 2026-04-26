import { useQuery } from '@tanstack/react-query';
import { compareVersions } from 'compare-versions';
import { useState } from 'react';
import { Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import { appApi } from '@/api';
import { GET_APP_VERSION_QUERY } from '@/shared/constants';
import { useAuth } from '@/shared/lib/auth';

const platform: 'ios' | 'android' = Platform.OS === 'ios' ? 'ios' : 'android';

export const useNewVersionDrawer = () => {
  const { isAuthenticated } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const currentVersion = DeviceInfo.getVersion();

  const { data } = useQuery({
    queryKey: [GET_APP_VERSION_QUERY, platform],
    queryFn: async () => (await appApi.versionList({ platform })).data,
    enabled: isAuthenticated,
    retry: false,
  });

  const latestVersion = data?.latestVersion;
  const storeUrl = platform === 'ios' ? data?.iosUrl : data?.androidUrl;
  const isNewVersionAvailable =
    !!latestVersion && compareVersions(latestVersion, currentVersion) > 0;

  const onUpdate = async () => {
    if (!storeUrl) return;
    const supported = await Linking.canOpenURL(storeUrl);
    if (supported) await Linking.openURL(storeUrl);
  };

  return {
    visible: !dismissed && isNewVersionAvailable,
    onClose: () => setDismissed(true),
    onUpdate,
    latestVersion,
    changelog: data?.changelog ?? null,
  };
};
