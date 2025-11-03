import { RouteProp, useRoute } from '@react-navigation/native';
import { FC, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/shared/constants';
import { useTheme } from '@/shared/theme';

type RouteParams = {
  InsuranceDocument: {
    uri: string;
  };
};

export const InsuranceDocumentScreen: FC = () => {
  const { colors } = useTheme();
  const { params } = useRoute<RouteProp<RouteParams, 'InsuranceDocument'>>();
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
          uri: params.uri,
        }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        style={{ flex: 1, width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}
      />
    </View>
  );
};
