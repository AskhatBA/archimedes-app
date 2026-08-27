import { FC } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { Button } from '@/shared/components/button';
import { CheckCircleIcon, FamilyIcon, HeartIcon } from '@/shared/icons';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

import { formatPrice } from '../../../lib/format-price';
import { PaidProgram } from '../../../types';

interface PaidProgramDetailsDrawerProps {
  program: PaidProgram | null;
  inCart: boolean;
  onClose: () => void;
  onToggleCart: (program: PaidProgram) => void;
}

export const PaidProgramDetailsDrawer: FC<PaidProgramDetailsDrawerProps> = ({
  program,
  inCart,
  onClose,
  onToggleCart,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const CoverageIcon = program?.coverage === 'FAMILY' ? FamilyIcon : HeartIcon;

  return (
    <BottomDrawer visible={!!program} onClose={onClose} scrollable>
      {program ? (
        <View style={[styles.content, { paddingBottom: insets.bottom }]}>
          <View style={styles.header}>
            <View style={styles.badge}>
              <CoverageIcon width={24} height={24} color={colors.blue['400']} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>{program.title}</Text>
              {program.coverage ? (
                <Text style={styles.coverage}>
                  {t(
                    program.coverage === 'FAMILY'
                      ? 'paidPrograms:coverage.family'
                      : 'paidPrograms:coverage.personal',
                  )}
                </Text>
              ) : null}
            </View>
          </View>

          {program.description ? (
            <Text style={styles.description}>{program.description}</Text>
          ) : null}

          <View style={styles.metaRow}>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>
                {t('paidPrograms:details.price')}
              </Text>
              <Text style={styles.metaValue}>{formatPrice(program.price)}</Text>
            </View>
            {program.duration ? (
              <View style={styles.metaCard}>
                <Text style={styles.metaLabel}>
                  {t('paidPrograms:details.duration')}
                </Text>
                <Text style={styles.metaValue}>{program.duration}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.servicesBlock}>
            <Text style={styles.servicesTitle}>
              {t('paidPrograms:details.included')}
            </Text>
            {program.services.map(service => (
              <View key={service} style={styles.serviceRow}>
                <CheckCircleIcon
                  width={18}
                  height={18}
                  color={colors.green['600']}
                />
                <Text style={styles.serviceText}>{service}</Text>
              </View>
            ))}
          </View>

          <Button
            variant={inCart ? 'secondary' : 'primary'}
            onPress={() => onToggleCart(program)}
          >
            {inCart
              ? t('paidPrograms:details.removeFromCart')
              : t('paidPrograms:details.addToCart')}
          </Button>
        </View>
      ) : null}
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.blue['150'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.blue['500'],
  },
  coverage: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.SFPro.Medium,
    color: colors.gray['500'],
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['600'],
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metaCard: {
    flex: 1,
    gap: 4,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.blue['100'],
    borderWidth: 1,
    borderColor: colors.blue['200'],
  },
  metaLabel: {
    fontSize: 11,
    fontFamily: fonts.SFPro.Medium,
    color: colors.gray['500'],
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Semibold,
    color: colors.blue['500'],
  },
  servicesBlock: {
    gap: 10,
  },
  servicesTitle: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Semibold,
    color: colors.textMain,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  serviceText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['600'],
  },
});
