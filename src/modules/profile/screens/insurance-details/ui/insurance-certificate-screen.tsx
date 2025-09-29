import { FC, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/shared/constants';
import { useTheme } from '@/shared/theme';

export const InsuranceCertificateScreen: FC = () => {
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  return (
    <View
      style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}
    >
      {loading && (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}
      <WebView
        source={{
          uri: 'https://mobileapitest.archimedes.kz/v1/certificate/22864eac-f198-4555-a3ac-0423db0edc0c',
        }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        style={{ flex: 1, width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      />
    </View>
  );
};
