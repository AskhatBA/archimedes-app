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
  Linking,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  FamilyMembers,
  INSURANCE_CERTIFICATE_URL,
  useProgramById,
} from '@/modules/insurance';
import { useUser } from '@/modules/user';
import { formatDate } from '@/shared/adapters/date';
import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { GET_PROGRAM_QUERY } from '@/shared/constants';
import {
  ClipIcon,
  HospitalIcon,
  InfoIcon,
  FileTextIcon,
  HeartIcon,
} from '@/shared/icons';
import { useNavigation, routes } from '@/shared/navigation';
import { useTheme } from '@/shared/theme';

interface RouteParams {
  programId: string;
}

export const InsuranceDetailsScreen: FC = () => {
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

  const onRefresh = async () => {
    await queryClient.refetchQueries({
      queryKey: [GET_PROGRAM_QUERY, programId],
    });
  };

  const openSupport = async () => {
    navigate(routes.InsuranceSupport);
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
              Страховая компания
            </Text>
            <Text style={[styles.mainInfoLabel, { color: colors.textMain }]}>
              {program.insuranceCompany}
            </Text>
          </View>
          <View style={{ gap: 4 }}>
            <Text style={[styles.mainInfoLabel, { color: colors.primary }]}>
              Номер страховой карты
            </Text>
            <Text style={[styles.mainInfoLabel, { color: colors.textMain }]}>
              {program.cardNo}
            </Text>
          </View>
          <View style={{ gap: 4 }}>
            <Text style={[styles.mainInfoLabel, { color: colors.primary }]}>
              Период страхования
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
              Страховой сертификат
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
        <View style={{ marginTop: 24 }}>
          <Text style={[styles.limitTitle, { color: colors.blue['370'] }]}>
            Использования лимитов
          </Text>
          {program?.subLimits.map(limit => (
            <View
              key={limit.name}
              style={[
                styles.limitContainer,
                {
                  backgroundColor: colors.blue['100'],
                  borderColor: colors.primary,
                },
              ]}
            >
              <Text style={[styles.limitName, { color: colors.primary }]}>
                {limit.name}
              </Text>
              <View
                style={[
                  styles.limitPrices,
                  { backgroundColor: colors.blue['300'] },
                ]}
              >
                <Text
                  style={[styles.limitPricesText, { color: colors.primary }]}
                >
                  Осталось {limit.currentLimit}тг из {limit.limit}тг
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomDrawer
        backdropPressEnabled={false}
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
  limitContainer: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 8,
  },
  limitName: {
    fontSize: 14,
    fontWeight: 600,
  },
  limitPrices: {
    borderRadius: 16,
    padding: 8,
  },
  limitPricesText: {},
  limitTitle: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 12,
  },
});
