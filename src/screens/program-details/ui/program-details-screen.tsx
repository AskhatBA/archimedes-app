import { useRoute } from '@react-navigation/native';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import { FC, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FamilyMembers,
  INSURANCE_CERTIFICATE_URL,
  useProgramById,
} from '@/modules/insurance';
import { useUser } from '@/modules/user';
import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { GET_PROGRAM_QUERY } from '@/shared/constants';
import { usePageHeader } from '@/shared/hooks';
import {
  ClipIcon,
  HospitalIcon,
  InfoIcon,
  FileTextIcon,
  HeartIcon,
  ShieldPlusIcon,
  CalendarIcon,
} from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useNavigation, routes } from '@/shared/navigation';
import { fonts, useTheme } from '@/shared/theme';

const formatAmount = (n: number) =>
  String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const pickLimitColor = (
  usedRatio: number,
  palette: { ok: string; warn: string; danger: string },
) => {
  if (usedRatio < 0.5) return palette.ok;
  if (usedRatio < 0.8) return palette.warn;
  return palette.danger;
};

interface RouteParams {
  programId: string;
}

export const ProgramDetailsScreen: FC = () => {
  const [openInformation, setOpenInformation] = useState(false);
  const route = useRoute();
  const deviceInsets = useSafeAreaInsets();
  const { programId } = route.params as RouteParams;
  const { colors } = useTheme();
  const { user } = useUser();
  const { navigate } = useNavigation();
  const { program, loadingProgram } = useProgramById(programId);
  const queryClient = useQueryClient();
  const isFetchingProgram = useIsFetching({
    queryKey: [GET_PROGRAM_QUERY, programId],
  });

  usePageHeader({ title: program?.title });

  const onRefresh = async () => {
    await queryClient.refetchQueries({
      queryKey: [GET_PROGRAM_QUERY, programId],
    });
  };

  const openSupport = async () => {
    navigate(routes.ProgramSupport);
  };

  if (loadingProgram) {
    return (
      <View style={{ marginTop: 32, alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const periodText =
    program?.dateStart && program?.dateEnd
      ? `${formatDate(program.dateStart, 'DD.MM.YYYY')} — ${formatDate(
          program.dateEnd,
          'DD.MM.YYYY',
        )}`
      : '';

  const totalLimit = program?.limit ?? 0;
  const totalRemaining = program?.currentLimit ?? 0;
  const totalUsed = Math.max(0, totalLimit - totalRemaining);
  const totalRatio = totalLimit > 0 ? Math.min(1, totalUsed / totalLimit) : 0;
  const totalRemainingPct = Math.round((1 - totalRatio) * 100);

  const navTiles: {
    key: string;
    label: string;
    icon: FC<{ width: number; height: number; color: string }>;
    onPress: () => void;
  }[] = [
    {
      key: 'certificate',
      label: 'Сертификат',
      icon: ClipIcon,
      onPress: () =>
        navigate(routes.DocumentViewer, {
          uri: INSURANCE_CERTIFICATE_URL.replace(':programId', program?.id),
        }),
    },
    {
      key: 'about',
      label: 'О программе',
      icon: InfoIcon,
      onPress: () =>
        navigate(routes.DocumentViewer, { uri: program?.programUrl }),
    },
    {
      key: 'network',
      label: 'Мед. сеть',
      icon: HospitalIcon,
      onPress: () => navigate(routes.MedicalNetwork, { programId }),
    },
    {
      key: 'referrals',
      label: 'Направления',
      icon: FileTextIcon,
      onPress: () => navigate(routes.ElectronicReferrals, { programId }),
    },
  ];

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          paddingBottom: deviceInsets.bottom + 32,
          gap: 20,
        }}
        refreshControl={
          <RefreshControl
            refreshing={!!isFetchingProgram}
            onRefresh={onRefresh}
          />
        }
      >
        {/* HERO */}
        <View
          style={[
            styles.hero,
            {
              backgroundColor: colors.blue['100'],
              borderColor: colors.blue['200'],
            },
          ]}
        >
          <View style={styles.heroTopRow}>
            <View
              style={[
                styles.heroBadge,
                { backgroundColor: colors.blue['400'] },
              ]}
            >
              <ShieldPlusIcon width={18} height={18} color={colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroEyebrow, { color: colors.blue['500'] }]}>
                Компания
              </Text>
              {!!program?.insuranceCompany && (
                <Text
                  style={[styles.heroCompany, { color: colors.blue['400'] }]}
                >
                  {program.insuranceCompany}
                </Text>
              )}
            </View>
          </View>

          <Text
            numberOfLines={2}
            style={[styles.heroTitle, { color: colors.textMain }]}
          >
            {program?.title}
          </Text>

          <View
            style={[
              styles.heroDivider,
              { backgroundColor: colors.blue['200'] },
            ]}
          />

          <View style={{ gap: 4 }}>
            <Text
              numberOfLines={1}
              style={[styles.heroUserName, { color: colors.textMain }]}
            >
              {user.fullName}
            </Text>
          </View>

          <View style={styles.heroChipsRow}>
            {!!program?.cardNo && (
              <View
                style={[
                  styles.heroChip,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.blue['200'],
                  },
                ]}
              >
                <Text
                  style={[styles.heroChipLabel, { color: colors.gray['500'] }]}
                >
                  Карта №
                </Text>
                <Text
                  style={[styles.heroChipValue, { color: colors.blue['400'] }]}
                >
                  {program.cardNo}
                </Text>
              </View>
            )}
            {!!periodText && (
              <View
                style={[
                  styles.heroChip,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.blue['200'],
                  },
                ]}
              >
                <View style={styles.heroChipHeader}>
                  <CalendarIcon
                    width={12}
                    height={12}
                    color={colors.gray['500']}
                  />
                  <Text
                    style={[
                      styles.heroChipLabel,
                      { color: colors.gray['500'] },
                    ]}
                  >
                    Период
                  </Text>
                </View>
                <Text
                  style={[styles.heroChipValue, { color: colors.blue['400'] }]}
                >
                  {periodText}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.tilesGrid}>
          {navTiles.map(tile => {
            const Icon = tile.icon;
            return (
              <TouchableOpacity
                key={tile.key}
                activeOpacity={0.85}
                onPress={tile.onPress}
                style={[
                  styles.tile,
                  {
                    backgroundColor: colors.gray['200'],
                    borderColor: colors.blue['200'],
                  },
                ]}
              >
                <View
                  style={[
                    styles.tileIconWrap,
                    { backgroundColor: colors.blue['150'] },
                  ]}
                >
                  <Icon width={22} height={22} color={colors.blue['400']} />
                </View>
                <Text
                  numberOfLines={2}
                  style={[styles.tileLabel, { color: colors.textMain }]}
                >
                  {tile.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={openSupport}
          style={[styles.supportTile, { backgroundColor: colors.blue['100'] }]}
        >
          <View
            style={[
              styles.supportIconWrap,
              { backgroundColor: colors.blue['400'] },
            ]}
          >
            <HeartIcon width={22} height={22} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.supportTitle, { color: colors.blue['400'] }]}>
              Поддержка
            </Text>
            <Text
              style={[styles.supportSubtitle, { color: colors.gray['600'] }]}
            >
              Свяжитесь с нами по любым вопросам
            </Text>
          </View>
        </TouchableOpacity>

        {/* FAMILY */}
        <View>
          <FamilyMembers programId={programId} />
        </View>

        {/* TOTAL LIMIT */}
        {totalLimit > 0 && (
          <View
            style={[
              styles.totalLimitCard,
              {
                backgroundColor: colors.blue['100'],
                borderColor: colors.blue['200'],
              },
            ]}
          >
            <Text style={[styles.limitsTitle, { color: colors.gray['700'] }]}>
              Общий лимит
            </Text>
            <View style={styles.totalLimitRow}>
              <Text
                style={[styles.totalLimitMain, { color: colors.blue['400'] }]}
              >
                {formatAmount(totalRemaining)} ₸
              </Text>
              <Text
                style={[styles.totalLimitSub, { color: colors.gray['500'] }]}
              >
                из {formatAmount(totalLimit)} ₸
              </Text>
            </View>
            <View
              style={[
                styles.progressTrack,
                { backgroundColor: colors.blue['200'] },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${totalRatio * 100}%`,
                    backgroundColor: colors.blue['400'],
                  },
                ]}
              />
            </View>
            <Text
              style={[styles.totalLimitFooter, { color: colors.gray['600'] }]}
            >
              Доступно {totalRemainingPct}% от программы
            </Text>
          </View>
        )}

        {/* SUB LIMITS */}
        {!!program?.subLimits?.length && (
          <View>
            <Text style={[styles.limitsTitle, { color: colors.gray['700'] }]}>
              Использование лимитов
            </Text>
            <View style={styles.limitsList}>
              {program.subLimits.map(limit => {
                const total = limit.limit ?? 0;
                const remaining = limit.currentLimit ?? 0;
                const used = Math.max(0, total - remaining);
                const usedRatio = total > 0 ? Math.min(1, used / total) : 0;
                const remainingPct = Math.round((1 - usedRatio) * 100);
                const fillColor = pickLimitColor(usedRatio, {
                  ok: colors.blue['400'],
                  warn: colors.gold['500'],
                  danger: colors.red['500'],
                });

                return (
                  <View
                    key={limit.name}
                    style={[
                      styles.limitCard,
                      {
                        backgroundColor: colors.white,
                        borderColor: colors.blue['200'],
                      },
                    ]}
                  >
                    <View style={styles.limitHeader}>
                      <Text
                        style={[
                          styles.limitName,
                          { color: colors.gray['700'] },
                        ]}
                        numberOfLines={2}
                      >
                        {limit.name}
                      </Text>
                      <View
                        style={[
                          styles.limitPctBadge,
                          { backgroundColor: `${fillColor}1A` },
                        ]}
                      >
                        <Text style={[styles.limitPct, { color: fillColor }]}>
                          {remainingPct}%
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.progressTrack,
                        { backgroundColor: colors.gray['200'] },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${usedRatio * 100}%`,
                            backgroundColor: fillColor,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.limitFooter}>
                      <Text
                        style={[
                          styles.limitFooterMain,
                          { color: colors.gray['700'] },
                        ]}
                      >
                        {formatAmount(remaining)} ₸
                      </Text>
                      <Text
                        style={[
                          styles.limitFooterSub,
                          { color: colors.gray['500'] },
                        ]}
                      >
                        из {formatAmount(total)} ₸
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
      <BottomDrawer
        visible={openInformation}
        onClose={() => setOpenInformation(false)}
      >
        <ScrollView contentContainerStyle={{ padding: 18 }}>
          <Text>{program.information || program.exclusions}</Text>
        </ScrollView>
      </BottomDrawer>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  // Hero
  hero: {
    borderRadius: 20,
    padding: 18,
    gap: 14,
    overflow: 'hidden',
    borderWidth: 1,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  heroCompany: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    fontFamily: fonts.SFPro.Bold,
  },
  heroDivider: {
    height: 1,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroUserName: {
    fontSize: 17,
    fontWeight: '700',
  },
  heroChipsRow: {
    flexDirection: 'column',
    gap: 10,
  },
  heroChip: {
    minWidth: 140,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
    borderWidth: 1,
  },
  heroChipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroChipLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  heroChipValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  // Tiles grid
  tilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    width: '48%',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    gap: 12,
    borderWidth: 1,
  },
  tileIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
  },
  // Support tile
  supportTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    padding: 16,
  },
  supportIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  supportSubtitle: {
    marginTop: 2,
    fontSize: 13,
  },
  // Limits
  totalLimitCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  totalLimitRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  totalLimitMain: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
  },
  totalLimitSub: {
    fontSize: 13,
    fontFamily: fonts.SFPro.Regular,
  },
  totalLimitFooter: {
    fontSize: 12,
    fontWeight: '500',
  },
  limitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    marginBottom: 12,
  },
  limitsList: {
    gap: 10,
  },
  limitCard: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  limitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  limitName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    flex: 1,
  },
  limitPctBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  limitPct: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  limitFooter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  limitFooterMain: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
  },
  limitFooterSub: {
    fontSize: 12,
    fontFamily: fonts.SFPro.Regular,
  },
});
