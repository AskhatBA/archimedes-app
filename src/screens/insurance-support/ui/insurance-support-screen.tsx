import { FC } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useContacts } from '@/modules/insurance';
import { useTheme } from '@/shared/theme';

const WHATSAPP_PHONE = '77019511647';

export const InsuranceSupportScreen: FC = () => {
  const { contacts, loadingContacts } = useContacts();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (loadingContacts) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  const getWhatsAppUrl = (phone: string) => `https://wa.me/${phone}`;

  const openWhatsApp = async () => {
    const url = getWhatsAppUrl(WHATSAPP_PHONE);
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  const hasContacts = Array.isArray(contacts) && contacts.length > 0;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: 'transparent', paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.gray['500'] }]}>
          WhatsApp
        </Text>
        <View style={styles.phonesContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.phoneChip,
              { backgroundColor: colors.gray['200'] },
            ]}
            onPress={openWhatsApp}
          >
            <Text style={[styles.phoneText, { color: colors.gray['500'] }]}>
              +{WHATSAPP_PHONE}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {hasContacts ? (
        contacts.map(({ city, phones }) => (
          <View key={city} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.gray['500'] }]}>
              {city}
            </Text>
            <View style={styles.phonesContainer}>
              {(phones || []).map(phone => (
                <TouchableOpacity
                  key={phone}
                  activeOpacity={0.8}
                  style={[
                    styles.phoneChip,
                    { backgroundColor: colors.gray['200'] },
                  ]}
                  onPress={() =>
                    Linking.openURL(`tel:${phone.replace(/[^+\d]/g, '')}`)
                  }
                >
                  <Text
                    style={[styles.phoneText, { color: colors.gray['500'] }]}
                  >
                    {phone}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))
      ) : (
        <View style={styles.empty}>
          <Text style={{ color: colors.textMain }}>
            Контактная информация недоступна
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: 500,
  },
  phonesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  phoneChip: {
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  phoneText: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 600,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 24,
  },
});
