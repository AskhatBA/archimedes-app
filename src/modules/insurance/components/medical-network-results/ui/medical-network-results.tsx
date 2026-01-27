import { FC } from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MedicalNetworkClinics } from '@/api';
import { MapPinnedIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

interface MedicalNetworkResultsProps {
  clinics: MedicalNetworkClinics[];
  city: string;
}

export const MedicalNetworkResults: FC<MedicalNetworkResultsProps> = ({
  clinics,
  city,
}) => {
  const { colors } = useTheme();

  const open2GIS = async (url?: string) => {
    if (!url) return;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch (e) {
      // silently fail
    }
  };

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

  if (clinics.length === 0) {
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

  return clinics.map(clinic => (
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

const styles = StyleSheet.create({
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
