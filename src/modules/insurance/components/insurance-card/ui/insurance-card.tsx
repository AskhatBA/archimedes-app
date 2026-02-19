import { FC } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { formatDate } from '@/shared/adapters/date';
import { useNavigation, routes } from '@/shared/navigation';
import { fonts, useTheme } from '@/shared/theme';

import { levelColors } from '../constants';

interface InsuranceCardProps {
  level: string;
  price: string;
  programId: string;
  dateEnd: string;
}

export const InsuranceCard: FC<InsuranceCardProps> = ({
  level,
  price,
  programId,
  dateEnd,
}) => {
  const { colors } = useTheme();
  const { navigate } = useNavigation();

  const defaultBackground = levelColors.Standard.background;
  const defaultTextColor = levelColors.Standard.text;
  const defaultButtonColor = levelColors.Standard.button;

  return (
    <View style={{ gap: 16 }}>
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              levelColors[level]?.background || defaultBackground,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: levelColors[level]?.text || defaultTextColor },
          ]}
        >
          {level}
        </Text>
        <Text
          style={[
            styles.price,
            { color: levelColors[level]?.text || defaultTextColor },
          ]}
        >
          {price}
        </Text>
        <Text style={[styles.date, { color: colors.gray['500'] }]}>
          Активен до: {formatDate(dateEnd, 'DD.MM.YYYY')}
        </Text>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: levelColors[level]?.button || defaultButtonColor,
            },
          ]}
          onPress={() => navigate(routes.InsuranceDetails, { programId })}
        >
          <Text
            style={[
              styles.buttonText,
              { color: levelColors[level]?.text || defaultTextColor },
            ]}
          >
            Перейти к деталям программы
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  title: {
    fontWeight: 700,
    fontSize: 16,
    lineHeight: 25,
    marginBottom: 8,
    fontFamily: fonts.SFPro.Bold,
  },
  price: {
    fontSize: 30,
    fontWeight: 300,
    marginBottom: 4,
    fontFamily: fonts.SFPro.Light,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: '#000',
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.SFPro.Medium,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 600,
    fontFamily: fonts.SFPro.Semibold,
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 24,
    fontFamily: fonts.SFPro.Medium,
  },
});
