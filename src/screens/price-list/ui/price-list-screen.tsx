import { FC, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useClinicsMo, usePriceList } from '@/modules/insurance';
import { SelectField } from '@/shared/components/select-field/ui/select-field';
import { usePageHeader } from '@/shared/hooks';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

export const PriceListScreen: FC = () => {
  const { t } = useTranslation();

  usePageHeader({ title: t('priceList:title') });

  const [selectedClinicId, setSelectedClinicId] = useState<string | null>(null);

  const { clinicOptions, isLoading: loadingClinics } = useClinicsMo();
  const { priceList, isLoading: loadingPrices } =
    usePriceList(selectedClinicId);

  const isLoading = loadingClinics || loadingPrices;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <SelectField
        options={clinicOptions}
        value={selectedClinicId ?? ''}
        placeholder={t('priceList:selectClinic')}
        onChange={value => setSelectedClinicId(value || null)}
        emptyText={t('priceList:clinicsEmpty')}
      />

      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator color={colors.blue[500]} size="large" />
        </View>
      )}

      {!loadingClinics && !selectedClinicId && (
        <Text style={styles.hint}>{t('priceList:hint')}</Text>
      )}

      {!isLoading && selectedClinicId && priceList.length === 0 && (
        <Text style={styles.empty}>{t('priceList:empty')}</Text>
      )}

      {!isLoading && priceList.length > 0 && (
        <View style={styles.list}>
          {priceList.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.service}>{item.service}</Text>
              <Text style={styles.price}>
                {item.price.toLocaleString('ru-RU')} ₸
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  loader: {
    paddingTop: 32,
    alignItems: 'center',
  },
  hint: {
    textAlign: 'center',
    paddingTop: 48,
    fontSize: 15,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray[500],
    lineHeight: 22,
  },
  empty: {
    textAlign: 'center',
    paddingTop: 32,
    fontSize: 14,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray[500],
  },
  list: {
    borderRadius: 14,
    backgroundColor: colors.gray[200],
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[250],
    gap: 12,
  },
  service: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray[700],
  },
  price: {
    fontSize: 14,
    fontFamily: fonts.SFPro.Semibold,
    color: colors.blue[500],
    flexShrink: 0,
  },
});
