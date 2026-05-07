import { FC } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { InsuranceNewsItem } from '@/api';
import { formatDate } from '@/shared/lib/date';
import { useTheme } from '@/shared/theme';

interface NewsCardProps {
  news: InsuranceNewsItem;
  width: number;
  onPress: () => void;
}

export const NewsCard: FC<NewsCardProps> = ({ news, width, onPress }) => {
  const { colors } = useTheme();

  const imageUri = news.image?.startsWith('data:')
    ? news.image
    : `data:image/jpeg;base64,${news.image}`;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        {
          width,
          backgroundColor: colors.gray['200'],
          borderColor: colors.blue['200'],
        },
      ]}
    >
      <View style={styles.imageWrap}>
        {!!news.image && (
          <Image source={{ uri: imageUri }} style={styles.image} />
        )}
        {!!news.date && (
          <View
            style={[styles.datePill, { backgroundColor: colors.blue['400'] }]}
          >
            <Text style={[styles.dateText, { color: colors.blue['100'] }]}>
              {formatDate(news.date, 'DD MMM YYYY')}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        {!!news.title && (
          <Text
            numberOfLines={2}
            style={[styles.title, { color: colors.blue['400'] }]}
          >
            {news.title}
          </Text>
        )}
        {!!news.message && (
          <Text
            numberOfLines={3}
            style={[styles.message, { color: colors.gray['600'] }]}
          >
            {news.message}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#E5EDF4',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  datePill: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '600',
  },
  body: {
    padding: 14,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 19,
  },
  message: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 17,
  },
});
