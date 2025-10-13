import { useRoute } from '@react-navigation/native';
import { FC, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';

import { SelectField } from '@/shared/components/select-field/ui/select-field';
import { TextField } from '@/shared/components/text-field/ui/text-field';
import { MapPinnedIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';
import { toCapitalize } from '@/shared/utils/to-capitalize';

import { clinicTypes } from '../constants';
import { useMedicalNetwork } from '../hooks/use-medical-network';

interface RouteParams {
  programId: string;
}

export const InsuranceMedicalNetworkScreen: FC = () => {
  const { colors } = useTheme();
  const [city, setCity] = useState<string>('');
  const [query, setQuery] = useState('');
  const route = useRoute();
  const { programId } = route.params as RouteParams;
  const [currentClinicType, setCurrentClinicType] = useState<number>();
  const { cityOptions, clinics, loading } = useMedicalNetwork({
    cityId: city,
    programId,
    type: currentClinicType,
  });

  const clinicTypeOptions = useMemo(
    () => [
      { label: 'Все типы', value: '' },
      ...clinicTypes.map(type => ({
        label: toCapitalize(type.title),
        value: String(type.id),
      })),
    ],
    [],
  );

  const filteredClinics = useMemo(
    () =>
      (clinics || []).filter(c => {
        if (!query) return true;
        const text = `${c.title ?? ''} ${c.address ?? ''}`.toLowerCase();
        return text.includes(query.toLowerCase());
      }),
    [clinics, query],
  );

  const open2GIS = async (url?: string) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch (e) {
      // silently fail
    }
  };

  const renderResults = () => {
    if (!city)
      return (
        <Text
          style={{
            color: colors.gray['600'],
            textAlign: 'center',
            marginTop: 32,
          }}
        >
          Город не выбран
        </Text>
      );

    if (filteredClinics.length === 0) {
      return (
        <Text
          style={{
            color: colors.gray['600'],
            textAlign: 'center',
            marginTop: 32,
          }}
        >
          Ничего не найдено
        </Text>
      );
    }

    return filteredClinics.map(clinic => (
      <View
        key={clinic.id}
        style={[styles.card, { backgroundColor: colors.gray['200'] }]}
      >
        <Text style={[styles.cardTitle, { color: colors.textMain }]}>
          {clinic.title}
        </Text>
        <TouchableOpacity
          onPress={() => open2GIS(clinic.link2GIS)}
          accessibilityRole="link"
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <MapPinnedIcon width={16} height={16} color={colors.primary} />
          <Text style={[styles.cardAddress, { color: colors.gray['600'] }]}>
            {clinic.address}
          </Text>
        </TouchableOpacity>
      </View>
    ));
  };

  return (
    <View style={{ flex: 1, paddingVertical: 16 }}>
      {loading ? (
        <View style={[styles.loaderContainer]}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
          <TextField
            placeholder="Поиск"
            value={query}
            onChangeText={setQuery}
          />

          <View style={{ height: 12 }} />

          <SelectField
            options={cityOptions}
            value={city}
            placeholder="Город"
            onChange={setCity}
          />

          <View style={{ height: 12 }} />

          <SelectField
            options={clinicTypeOptions}
            value={currentClinicType ? String(currentClinicType) : ''}
            placeholder="Тип клиники"
            onChange={value => {
              if (!value) {
                setCurrentClinicType(undefined);
                return;
              }
              const clinicTypeId = Number(value);
              setCurrentClinicType(
                Number.isNaN(clinicTypeId) ? undefined : clinicTypeId,
              );
            }}
          />

          <View style={{ marginTop: 24, gap: 12 }}>{renderResults()}</View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 8,
  },
  cardAddress: {
    fontSize: 14,
    fontWeight: 500,
  },
});
