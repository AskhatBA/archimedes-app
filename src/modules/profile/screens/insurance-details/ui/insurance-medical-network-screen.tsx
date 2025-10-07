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

import { Checkbox } from '@/shared/components/checkbox';
import { SelectField } from '@/shared/components/select-field/ui/select-field';
import { TextField } from '@/shared/components/text-field/ui/text-field';
import { MapPinnedIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

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
  const { cityOptions, clinics, loading } = useMedicalNetwork({
    cityId: city,
    programId,
  });
  const [filters, setFilters] = useState({
    clinic: false,
    pharmacy: false,
    dentistry: false,
    med: false,
  });

  const toggle = (key: keyof typeof filters) =>
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));

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

  return (
    <View style={{ flex: 1, paddingVertical: 16 }}>
      {loading ? (
        <View style={[styles.loaderContainer]}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
          <SelectField
            options={cityOptions}
            value={city}
            placeholder="Город"
            onChange={setCity}
          />
          <View style={{ height: 12 }} />
          <TextField
            placeholder="Поиск"
            value={query}
            onChangeText={setQuery}
          />

          <View style={styles.filters}>
            <View style={styles.filterItem}>
              <Checkbox
                checked={filters.clinic}
                onCheck={() => toggle('clinic')}
              />
              <Text style={[styles.filterLabel, { color: colors.textMain }]}>
                Клиника
              </Text>
            </View>
            <View style={styles.filterItem}>
              <Checkbox
                checked={filters.pharmacy}
                onCheck={() => toggle('pharmacy')}
              />
              <Text style={[styles.filterLabel, { color: colors.textMain }]}>
                Аптека
              </Text>
            </View>
            <View style={styles.filterItem}>
              <Checkbox
                checked={filters.dentistry}
                onCheck={() => toggle('dentistry')}
              />
              <Text style={[styles.filterLabel, { color: colors.textMain }]}>
                Стоматология
              </Text>
            </View>
            <View style={[styles.filterItem, { marginTop: 8 }]}>
              <Checkbox checked={filters.med} onCheck={() => toggle('med')} />
              <Text style={[styles.filterLabel, { color: colors.textMain }]}>
                Мед. учреждения
              </Text>
            </View>
          </View>

          <View style={{ gap: 12 }}>
            {filteredClinics.length === 0 ? (
              <Text
                style={{
                  color: colors.gray['600'],
                  textAlign: 'center',
                  marginTop: 32,
                }}
              >
                Ничего не найдено
              </Text>
            ) : (
              filteredClinics.map(clinic => (
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
                    <MapPinnedIcon
                      width={16}
                      height={16}
                      color={colors.primary}
                    />
                    <Text
                      style={[
                        styles.cardAddress,
                        { color: colors.gray['600'] },
                      ]}
                    >
                      {clinic.address}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
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
  filters: {
    marginTop: 12,
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 600,
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
