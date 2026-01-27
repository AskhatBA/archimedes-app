import { useRoute } from '@react-navigation/native';
import { FC, useMemo } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

import {
  MedicalNetworkResults,
  useMedicalNetwork,
  useClinicTypes,
  useMedicalNetworkReducer,
} from '@/modules/insurance';
import { SelectField } from '@/shared/components/select-field/ui/select-field';
import { TextField } from '@/shared/components/text-field/ui/text-field';
import { useTheme } from '@/shared/theme';
import { toCapitalize } from '@/shared/utils/to-capitalize';

interface RouteParams {
  programId: string;
}

export const MedicalNetworkScreen: FC = () => {
  const { colors } = useTheme();
  const route = useRoute();
  const { programId } = route.params as RouteParams;

  const [state, dispatch] = useMedicalNetworkReducer();
  const { city, query, currentClinicType } = state;
  const { clinicTypes } = useClinicTypes();

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
    [clinicTypes],
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
            onChangeText={value =>
              dispatch({ type: 'SET_QUERY', payload: value })
            }
          />

          <View style={{ height: 12 }} />

          <SelectField
            options={cityOptions}
            value={city}
            placeholder="Город"
            onChange={value => dispatch({ type: 'SET_CITY', payload: value })}
          />

          <View style={{ height: 12 }} />

          <SelectField
            options={clinicTypeOptions}
            value={currentClinicType ? String(currentClinicType) : ''}
            placeholder="Тип клиники"
            onChange={value => {
              if (!value) {
                dispatch({ type: 'SET_CLINIC_TYPE', payload: undefined });
                return;
              }
              const clinicTypeId = Number(value);
              dispatch({
                type: 'SET_CLINIC_TYPE',
                payload: Number.isNaN(clinicTypeId) ? undefined : clinicTypeId,
              });
            }}
          />

          <View style={{ marginTop: 24, gap: 12 }}>
            <MedicalNetworkResults city={city} clinics={filteredClinics} />
          </View>
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
