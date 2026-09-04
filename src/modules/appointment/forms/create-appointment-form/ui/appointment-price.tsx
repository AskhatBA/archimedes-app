import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatPrice } from '@/modules/paid-programs/lib/format-price';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

import { useCreateAppointment } from '../../../context/create-appointment-context';

import { createAppointmentFormStyles } from './styles';

/**
 * Приём по страховой программе оплачивает страховая, поэтому цена показывается
 * только тогда, когда запись оформляется платно — то есть без выбранной программы.
 */
export const AppointmentPrice: FC = () => {
  const { t } = useTranslation();
  const { formValues, medicService, isPaidVisit } = useCreateAppointment();

  if (!isPaidVisit) return null;
  if (!formValues.doctorId || !medicService) return null;

  return (
    <View>
      <Text
        style={[
          createAppointmentFormStyles.title,
          { color: colors.gray['500'] },
        ]}
      >
        {t('appointments:create.priceLabel')}
      </Text>
      <View style={styles.card}>
        <Text style={styles.service} numberOfLines={2}>
          {medicService.service}
        </Text>
        <Text style={styles.price}>{formatPrice(medicService.price)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.blue['100'],
    borderWidth: 1,
    borderColor: colors.blue['200'],
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  service: {
    flexShrink: 1,
    flexGrow: 1,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fonts.SFPro.Regular,
    color: colors.textMain,
  },
  price: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['400'],
  },
});
