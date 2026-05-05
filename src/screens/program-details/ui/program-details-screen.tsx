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

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: deviceInsets.bottom + 32 }}
        refreshControl={
          <RefreshControl
            refreshing={!!isFetchingProgram}
            onRefresh={onRefresh}
          />
        }
      >
        <Text style={[styles.userName, { color: colors.primary }]}>
          {user.fullName}
        </Text>
        <Text style={[styles.insuranceType, { color: colors.textMain }]}>
          {program.title}
        </Text>
        <View
          style={[styles.mainInfo, { backgroundColor: colors.blue['100'] }]}
        >
          <View style={{ gap: 4 }}>
            <Text style={[styles.mainInfoLabel, { color: colors.primary }]}>
              Компания
            </Text>
            <Text style={[styles.mainInfoLabel, { color: colors.textMain }]}>
              {program.insuranceCompany}
            </Text>
          </View>
          <View style={{ gap: 4 }}>
            <Text style={[styles.mainInfoLabel, { color: colors.primary }]}>
              Номер карты
            </Text>
            <Text style={[styles.mainInfoLabel, { color: colors.textMain }]}>
              {program.cardNo}
            </Text>
          </View>
          <View style={{ gap: 4 }}>
            <Text style={[styles.mainInfoLabel, { color: colors.primary }]}>
              Период программы
            </Text>
            <Text style={[styles.mainInfoLabel, { color: colors.textMain }]}>
              {program?.dateStart &&
                formatDate(program.dateStart, 'DD.MM.YYYY')}{' '}
              - {program?.dateEnd && formatDate(program.dateEnd, 'DD.MM.YYYY')}
            </Text>
          </View>
        </View>
        <View style={styles.documents}>
          <TouchableOpacity
            onPress={() =>
              navigate(routes.DocumentViewer, {
                uri: INSURANCE_CERTIFICATE_URL.replace(
                  ':programId',
                  program?.id,
                ),
              })
            }
            style={[
              styles.documentItem,
              { backgroundColor: colors.gray['200'] },
            ]}
          >
            <ClipIcon width={24} height={24} color={colors.primary} />
            <Text style={[styles.documentItemText, { color: colors.textMain }]}>
              Сертификат программы
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigate(routes.DocumentViewer, {
                uri: program?.programUrl,
              })
            }
            style={[
              styles.documentItem,
              { backgroundColor: colors.gray['200'] },
            ]}
          >
            <InfoIcon width={24} height={24} color={colors.primary} />
            <Text style={[styles.documentItemText, { color: colors.textMain }]}>
              О программе
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate(routes.MedicalNetwork, { programId })}
            style={[
              styles.documentItem,
              { backgroundColor: colors.gray['200'] },
            ]}
          >
            <HospitalIcon width={24} height={24} color={colors.primary} />
            <Text style={[styles.documentItemText, { color: colors.textMain }]}>
              Медицинская сеть
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigate(routes.ElectronicReferrals, { programId })}
            style={[
              styles.documentItem,
              { backgroundColor: colors.gray['200'] },
            ]}
          >
            <FileTextIcon width={24} height={24} color={colors.primary} />
            <Text style={[styles.documentItemText, { color: colors.textMain }]}>
              Электронные направления
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openSupport()}
            style={[
              styles.documentItem,
              { backgroundColor: colors.gray['200'] },
            ]}
          >
            <HeartIcon width={24} height={24} color={colors.primary} />
            <Text style={[styles.documentItemText, { color: colors.textMain }]}>
              Поддержка
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 24 }}>
          <FamilyMembers programId={programId} />
        </View>
        <View style={styles.limitsSection}>
          <Text style={[styles.limitsTitle, { color: colors.gray['700'] }]}>
            Использование лимитов
          </Text>
          <View style={styles.limitsList}>
            {program?.subLimits.map(limit => {
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
                      style={[styles.limitName, { color: colors.gray['700'] }]}
                      numberOfLines={2}
                    >
                      {limit.name}
                    </Text>
                    <Text style={[styles.limitPct, { color: fillColor }]}>
                      {remainingPct}%
                    </Text>
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
    paddingHorizontal: 24,
  },
  userName: {
    fontSize: 24,
    fontWeight: 700,
  },
  insuranceType: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 600,
  },
  mainInfo: {
    borderRadius: 16,
    padding: 18,
    gap: 16,
    marginTop: 16,
  },
  mainInfoLabel: {
    fontWeight: 300,
    fontSize: 16,
  },
  mainInfoValue: {
    fontWeight: 300,
    fontSize: 16,
  },
  documents: {
    marginTop: 24,
    gap: 16,
  },
  documentItem: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 16,
  },
  documentItemText: {
    fontSize: 16,
    fontWeight: 600,
  },
  limitsSection: {
    marginTop: 24,
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
  limitPct: {
    fontSize: 13,
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
