import { FC } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import CalendarIcon from '@/assets/icons/calendar.svg';
import FileIcon from '@/assets/icons/file.svg';
import HeartIcon from '@/assets/icons/heart.svg';
import LikeIcon from '@/assets/icons/like.svg';
import { useTheme } from '@/shared/theme';

export const FeatureGrid: FC = () => {
  const { colors } = useTheme();

  const features = [
    {
      icon: <CalendarIcon />,
      title: 'Записаться на прием',
      text: 'Найдите врача и запишитесь на прием',
      background: colors.blue['300'],
    },
    {
      icon: <HeartIcon color={colors.red['300']} />,
      title: 'Получить совет',
      text: 'Расскажите о своих симптомах и получите рекомендацию',
      background: colors.red['100'],
    },
    {
      icon: <FileIcon color={colors.orange['600']} />,
      title: 'Посмотреть документы',
      text: 'Найдите медицинский  документ или загрузите новый',
      background: colors.orange['100'],
    },
    {
      icon: <LikeIcon color={colors.green['600']} />,
      title: 'Отзывы о врачах',
      text: 'Оставьте отзыв о враче или посмотрите отзывы других пользователей',
      background: colors.green['200'],
    },
  ];

  return (
    <View style={styles.container}>
      {features.map(feature => (
        <View
          key={feature.title}
          style={[
            styles.featureContainer,
            { backgroundColor: colors.gray['200'] },
          ]}
        >
          <View style={[styles.icon, { backgroundColor: feature.background }]}>
            {feature.icon}
          </View>
          <Text style={[styles.title, { color: colors.textMain }]}>
            {feature.title}
          </Text>
          <Text style={[styles.text, { color: colors.gray['500'] }]}>
            {feature.text}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 36,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContainer: {
    borderRadius: 16,
    padding: 13,
    width: '48%',
    marginBottom: 16,
    gap: 12,
  },
  title: {
    fontWeight: 700,
    fontSize: 15,
    lineHeight: 18,
  },
  text: {},
});
