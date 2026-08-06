import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { Button } from '@/shared/components/button';
import { InfoIcon, SmartphoneIcon, UserOutlinedIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { fonts, useTheme } from '@/shared/theme';

interface ConfirmCredentialsDrawerProps {
  visible: boolean;
  phone: string;
  iin: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmCredentialsDrawer: FC<ConfirmCredentialsDrawerProps> = ({
  visible,
  phone,
  iin,
  isLoading,
  onConfirm,
  onClose,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const rows = [
    {
      key: 'phone',
      label: t('auth:phoneNumber'),
      value: phone,
      icon: (
        <SmartphoneIcon width={20} height={20} color={colors.blue['400']} />
      ),
    },
    {
      key: 'iin',
      label: t('auth:iin'),
      value: iin,
      icon: (
        <UserOutlinedIcon width={20} height={20} color={colors.blue['400']} />
      ),
    },
  ];

  return (
    <BottomDrawer visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View
          style={[styles.iconOuter, { backgroundColor: colors.orange['200'] }]}
        >
          <View
            style={[
              styles.iconInner,
              { backgroundColor: colors.orange['300'] },
            ]}
          >
            <InfoIcon width={32} height={32} color={colors.orange['600']} />
          </View>
        </View>

        <Text style={[styles.title, { color: colors.gray['700'] }]}>
          {t('auth:confirmDataTitle')}
        </Text>

        <Text style={[styles.description, { color: colors.gray['500'] }]}>
          {t('auth:confirmDataDescription')}
        </Text>

        <View style={[styles.card, { backgroundColor: colors.blue['100'] }]}>
          {rows.map((row, index) => (
            <View key={row.key}>
              {index > 0 ? (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: colors.blue['200'] },
                  ]}
                />
              ) : null}
              <View style={styles.row}>
                <View
                  style={[
                    styles.rowIcon,
                    { backgroundColor: colors.blue['150'] },
                  ]}
                >
                  {row.icon}
                </View>
                <View style={styles.rowTexts}>
                  <Text
                    style={[styles.rowLabel, { color: colors.gray['500'] }]}
                  >
                    {row.label}
                  </Text>
                  <Text
                    style={[styles.rowValue, { color: colors.gray['700'] }]}
                  >
                    {row.value}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <Text style={[styles.hint, { color: colors.gray['500'] }]}>
          {t('auth:confirmDataHint')}
        </Text>

        <Button
          onPress={onConfirm}
          isLoading={isLoading}
          style={styles.primaryButton}
        >
          {t('auth:confirmDataConfirm')}
        </Button>

        <TouchableOpacity
          onPress={onClose}
          disabled={isLoading}
          style={styles.secondaryButton}
          activeOpacity={0.6}
        >
          <Text style={[styles.secondaryText, { color: colors.blue['400'] }]}>
            {t('auth:confirmDataEdit')}
          </Text>
        </TouchableOpacity>
      </View>
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 8,
    alignItems: 'center',
  },
  iconOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.SFPro.Regular,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  card: {
    width: '100%',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  divider: {
    height: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTexts: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: 13,
    fontFamily: fonts.SFPro.Regular,
  },
  rowValue: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    letterSpacing: 0.4,
  },
  hint: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.SFPro.Regular,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  secondaryText: {
    fontSize: 15,
    fontFamily: fonts.SFPro.Medium,
    fontWeight: '600',
    textAlign: 'center',
  },
});
