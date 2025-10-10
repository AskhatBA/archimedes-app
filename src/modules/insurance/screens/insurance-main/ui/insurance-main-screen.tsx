import { FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InsuranceCard } from '@/modules/insurance/components/insurance-card';
import { Button } from '@/shared/components/button';
import { ScreenLoader } from '@/shared/components/screen-loader';
import { FilePenIcon, ShieldX } from '@/shared/icons';
import { usePrograms } from '@/shared/lib/insurance';
import { useNavigation, routes } from '@/shared/navigation';
import { colors, globalStyles } from '@/shared/theme';

import { CompensationHistory } from '../components/compensation-history';

export const InsuranceMainScreen: FC = () => {
  const { programs, loadingPrograms } = usePrograms();
  const { navigate } = useNavigation();
  const deviceInsets = useSafeAreaInsets();

  if (loadingPrograms) {
    return <ScreenLoader text="Получаем данные из страховой" />;
  }

  if (!programs || programs.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
        }}
      >
        <ShieldX width={120} height={120} color={colors.blue['370']} />
        <Text style={{ fontWeight: 400, fontSize: 18, color: colors.primary }}>
          У вас пока нет активных страховок
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: deviceInsets.bottom + 80 },
        ]}
      >
        <View style={styles.container}>
          <Text style={globalStyles.sectionHeading}>Страховка</Text>
          <View style={styles.cards}>
            {programs.map(program => {
              if (program.status === 'EXPIRED') return null;

              return (
                <InsuranceCard
                  key={program.id}
                  dateEnd={program.dateEnd}
                  programId={program.id}
                  price={program.cardNo}
                  level={program.title}
                />
              );
            })}
          </View>
          <CompensationHistory />
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.compensationButton}>
        <Button
          icon={<FilePenIcon width={22} height={22} color={colors.white} />}
          onPress={() => navigate(routes.Compensation)}
        >
          Заявка на возмещение
        </Button>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  container: {
    flex: 1,
  },
  cards: {
    marginTop: 20,
    gap: 16,
  },
  noInsuranceText: {
    fontSize: 14,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compensationButton: {
    width: '100%',
    position: 'absolute',
    padding: 16,
    bottom: 0,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});
