import { FC } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { getNewsKey, useNews } from '@/modules/insurance/hooks/use-news';
import { useTranslation } from '@/shared/lib/i18n';
import { routes, useNavigation } from '@/shared/navigation';
import { globalStyles, useTheme } from '@/shared/theme';

import { NewsCard } from './news-card';

const HORIZONTAL_PADDING = 16;
const CARD_GAP = 12;

export const News: FC = () => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();
  const { width } = useWindowDimensions();
  const { news, loadingNews } = useNews();
  const { t } = useTranslation();

  const cardWidth = Math.round(width - HORIZONTAL_PADDING * 2 - 48);

  const renderContent = () => {
    if (loadingNews) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      );
    }

    if (!news?.length) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.gray['500'] }]}>
            {t('home:noNews')}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        decelerationRate="fast"
        snapToInterval={cardWidth + CARD_GAP}
        snapToAlignment="start"
      >
        {news.map(item => {
          const newsKey = getNewsKey(item);
          return (
            <NewsCard
              key={newsKey}
              news={item}
              width={cardWidth}
              onPress={() => navigate(routes.NewsDetails, { newsKey })}
            />
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.wrapper}>
      <Text style={[globalStyles.sectionHeading, styles.heading]}>
        {t('home:news')}
      </Text>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: -16,
  },
  heading: {
    marginLeft: 16,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingBottom: 4,
    gap: CARD_GAP,
  },
  loaderContainer: {
    paddingVertical: 24,
  },
  emptyContainer: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingVertical: 16,
  },
  emptyText: {
    fontSize: 14,
  },
});
