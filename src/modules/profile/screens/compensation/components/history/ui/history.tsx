import { FC } from 'react';
import {
  FlatList,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { SCREEN_HEIGHT } from '@/shared/constants';
import { useUserCompensationRequests } from '@/shared/lib/insurance';
import { useTheme } from '@/shared/theme';

import { CompensationCard } from './compensation-card';

export const History: FC = () => {
  const { colors } = useTheme();
  const { compensationRequests, loadingCompensationRequests } =
    useUserCompensationRequests();

  if (loadingCompensationRequests)
    return (
      <View style={{ flex: 1, marginTop: SCREEN_HEIGHT * 0.3 }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );

  if (!compensationRequests?.length)
    return (
      <View
        style={{
          flex: 1,
          marginTop: SCREEN_HEIGHT * 0.3,
          alignItems: 'center',
        }}
      >
        <Text style={[styles.noItemsText, { color: colors.gray['500'] }]}>
          У вас пока нет заявок на возмещение
        </Text>
      </View>
    );

  return (
    <FlatList
      data={compensationRequests}
      renderItem={({ item: request }) => <CompensationCard {...request} />}
      keyExtractor={request => `${request.id}`}
      contentContainerStyle={{ gap: 16 }}
    />
  );
};

const styles = StyleSheet.create({
  noItemsText: {
    fontSize: 16,
  },
});
