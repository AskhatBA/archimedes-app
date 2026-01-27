import { RouteProp, useRoute } from '@react-navigation/native';
import { FC, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/shared/constants';
import { useTheme } from '@/shared/theme';

type RouteParams = {
  InsuranceDocument: {
    uri: string;
  };
};

export const DocumentViewerScreen: FC = () => {
  const { colors } = useTheme();
  const { params } = useRoute<RouteProp<RouteParams, 'InsuranceDocument'>>();
  const [loading, setLoading] = useState(true);

  const fileUri = Platform.select({
    ios: params.uri,
    android: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(params.uri)}`,
  });

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
          uri: fileUri,
        }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
        style={{ flex: 1, width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      />
    </View>
  );
};
