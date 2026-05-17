import { useRoute } from '@react-navigation/native';
import { FC } from 'react';
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { getNewsKey, useNews } from '@/modules/insurance';
import { Button } from '@/shared/components/button';
import { ScreenLoader } from '@/shared/components/screen-loader';
import { usePageHeader } from '@/shared/hooks';
import { CalendarIcon } from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTheme } from '@/shared/theme';

interface RouteParams {
  newsKey: string;
}

export const NewsDetailsScreen: FC = () => {
  usePageHeader({ title: 'Новость' });

  const route = useRoute();
  const { newsKey } = route.params as RouteParams;
  const { colors } = useTheme();
  const { news, loadingNews } = useNews();

  if (loadingNews) return <ScreenLoader />;

  const item = news?.find(n => getNewsKey(n) === newsKey);

  if (!item) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.gray['500'] }]}>
          Новость не найдена
        </Text>
      </View>
    );
  }

  const imageUri = item.image?.startsWith('data:')
    ? item.image
    : `data:image/jpeg;base64,${item.image}`;

  const openSource = async () => {
    if (!item.url) return;
    const supported = await Linking.canOpenURL(item.url);
    if (supported) await Linking.openURL(item.url);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {!!item.image && (
        <View style={styles.imageWrap}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

      <View style={styles.body}>
        {!!item.date && (
          <View
            style={[styles.dateRow, { backgroundColor: colors.blue['100'] }]}
          >
            <CalendarIcon width={16} height={16} color={colors.blue['400']} />
            <Text style={[styles.dateText, { color: colors.blue['400'] }]}>
              {formatDate(item.date, 'DD MMMM YYYY')}
            </Text>
          </View>
        )}

        {!!item.title && (
          <Text style={[styles.title, { color: colors.textMain }]}>
            {item.title}
          </Text>
        )}

        {!!item.message && (
          <Text style={[styles.message, { color: colors.gray['700'] }]}>
            {item.message}
          </Text>
        )}

        {!!item.url && (
          <Button style={styles.linkButton} onPress={openSource}>
            Перейти к источнику
          </Button>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#E5EDF4',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  body: {
    paddingHorizontal: 16,
    paddingTop: 20,
    gap: 14,
  },
  dateRow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  linkButton: {
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
  },
});
