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
import { usePageHeader } from '@/shared/hooks';
import {
  WhatsAppIcon,
  MapPinnedIcon,
  ClipboardListIcon,
  PhoneIcon,
} from '@/shared/icons';
import { useTheme } from '@/shared/theme';

const WHATSAPP_PHONE = '77019511647';

export const ProgramSupportScreen: FC = () => {
  usePageHeader({ title: 'Поддержка' });

  const { contacts, loadingContacts } = useContacts();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (loadingContacts) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
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
      Alert.alert('Ошибка', 'Не удается открыть WhatsApp');
    }
  };

  const hasContacts = Array.isArray(contacts) && contacts.length > 0;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingBottom: insets.bottom + 16 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: colors.gray['200'] }]}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <WhatsAppIcon width={28} height={28} color={colors.primary} />
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={[styles.cardTitle, { color: colors.textMain }]}>
              WhatsApp
            </Text>
            <Text style={[styles.cardSubtitle, { color: colors.gray['400'] }]}>
              Быстрая связь через мессенджер
            </Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles.whatsappButton,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
            },
          ]}
          onPress={openWhatsApp}
        >
          <Text style={styles.whatsappButtonText}>+{WHATSAPP_PHONE}</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {hasContacts ? (
        <>
          <View style={styles.divider}>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: colors.gray['200'] },
              ]}
            />
            <Text style={[styles.dividerText, { color: colors.gray['400'] }]}>
              или позвоните нам
            </Text>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: colors.gray['200'] },
              ]}
            />
          </View>

          {contacts.map(({ city, phones }) => (
            <View
              key={city}
              style={[styles.card, { backgroundColor: colors.gray['200'] }]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <MapPinnedIcon
                    width={28}
                    height={28}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.cardHeaderText}>
                  <Text style={[styles.cardTitle, { color: colors.textMain }]}>
                    {city}
                  </Text>
                  <Text
                    style={[styles.cardSubtitle, { color: colors.gray['400'] }]}
                  >
                    {phones?.length || 0}{' '}
                    {phones?.length === 1 ? 'номер' : 'номера'}
                  </Text>
                </View>
              </View>
              <View style={styles.phonesContainer}>
                {(phones || []).map(phone => (
                  <TouchableOpacity
                    key={phone}
                    activeOpacity={0.7}
                    style={[
                      styles.phoneButton,
                      {
                        backgroundColor: colors.gray['100'],
                        borderColor: colors.gray['200'],
                      },
                    ]}
                    onPress={() =>
                      Linking.openURL(`tel:${phone.replace(/[^+\d]/g, '')}`)
                    }
                  >
                    <PhoneIcon width={20} height={20} color={colors.primary} />
                    <Text
                      style={[styles.phoneText, { color: colors.textMain }]}
                    >
                      {phone}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </>
      ) : (
        <View
          style={[styles.emptyCard, { backgroundColor: colors.gray['250'] }]}
        >
          <ClipboardListIcon
            width={48}
            height={48}
            color={colors.gray['400']}
          />
          <Text style={[styles.emptyText, { color: colors.gray['500'] }]}>
            Контактная информация недоступна
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 16,
    padding: 8,
    margin: 8,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400',
  },
  whatsappButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  whatsappButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
  },
  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  phonesContainer: {
    gap: 12,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  phoneText: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '600',
    flex: 1,
  },
  emptyCard: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
