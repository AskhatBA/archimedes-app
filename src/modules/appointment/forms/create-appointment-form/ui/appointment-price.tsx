import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { formatPrice } from '@/modules/paid-programs/lib/format-price';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

import { useCreateAppointment } from '../../../context/create-appointment-context';

import { createAppointmentFormStyles } from './styles';

/**
 * Приём по страховой программе оплачивает страховая, поэтому цена показывается
 * только тогда, когда запись оформляется платно — то есть без выбранной программы, —
 * или по программе медсчёта (`isMedAccount`): такой приём списывается с медсчёта по
 * цене страховой. Если у услуги есть цена по медсчёту, полная цена зачёркивается
 * рядом с ней, иначе показывается одна полная.
 */
export const AppointmentPrice: FC = () => {
  const {
    formValues,
    medicService,
    isPaidVisit,
    isMedAccountVisit,
    servicePrice,
  } = useCreateAppointment();

  if (!formValues.doctorId || !medicService) return null;

  if (isPaidVisit) {
    return (
      <PriceCard service={medicService.service} price={medicService.price} />
    );
  }

  if (isMedAccountVisit && servicePrice) {
    return (
      <PriceCard
        service={medicService.service}
        price={servicePrice.price}
        discountedPrice={servicePrice.priceMedAccount}
      />
    );
  }

  return null;
};

const PriceCard: FC<{
  service: string;
  price: number;
  /** Цена со скидкой; полная цена показывается зачёркнутой рядом с ней. */
  discountedPrice?: number | null;
}> = ({ service, price, discountedPrice }) => {
  const { t } = useTranslation();

  const hasDiscount = discountedPrice != null && discountedPrice > 0;

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
          {service}
        </Text>
        {hasDiscount ? (
          <View style={styles.prices}>
            <Text style={styles.fullPrice}>{formatPrice(price)}</Text>
            <Text style={styles.price}>{formatPrice(discountedPrice)}</Text>
          </View>
        ) : (
          <Text style={styles.price}>{formatPrice(price)}</Text>
        )}
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
  prices: {
    alignItems: 'flex-end',
  },
  fullPrice: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['500'],
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['400'],
  },
});
