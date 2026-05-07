import { FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProgramCard } from '@/modules/insurance';
import { ScreenLoader } from '@/shared/components/screen-loader';
import { CALL_CENTER_PHONE } from '@/shared/constants';
import { ShieldX } from '@/shared/icons';
import { usePrograms } from '@/shared/lib/insurance';
import { colors } from '@/shared/theme';

export const ProgramsScreen: FC = () => {
  const { programs, loadingPrograms, refetchPrograms } = usePrograms();
  const deviceInsets = useSafeAreaInsets();

  if (loadingPrograms) {
    return <ScreenLoader text="Загружаем ваши программы..." />;
  }

  if (
    !programs ||
    programs.length === 0 ||
    programs.every(program => program.status === 'EXPIRED')
  ) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.emptyScroll,
          { paddingBottom: deviceInsets.bottom + 80 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={loadingPrograms}
            onRefresh={refetchPrograms}
          />
        }
      >
        <View
          style={[
            styles.emptyCard,
            {
              backgroundColor: colors.blue['100'],
              borderColor: colors.blue['200'],
            },
          ]}
        >
          <View
            style={[
              styles.emptyIconWrap,
              { backgroundColor: colors.blue['150'] },
            ]}
          >
            <ShieldX width={56} height={56} color={colors.blue['400']} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textMain }]}>
            У вас пока нет активных программ
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.gray['500'] }]}>
            Активные программы появятся здесь автоматически. Потяните вниз,
            чтобы обновить список.
            {'\n\n'}
            Если данные отображаются некорректно, обратитесь в колл-центр по
            номеру{' '}
            <Text
              style={[styles.emptyPhone, { color: colors.blue['400'] }]}
              onPress={() => Linking.openURL(`tel:${CALL_CENTER_PHONE}`)}
            >
              {CALL_CENTER_PHONE}
            </Text>
            .
          </Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: deviceInsets.bottom + 80 },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={loadingPrograms}
          onRefresh={refetchPrograms}
        />
      }
    >
      <View style={styles.container}>
        <View style={styles.cards}>
          {programs.map(program => {
            if (program.status === 'EXPIRED') return null;

            return (
              <ProgramCard
                key={program.id}
                dateEnd={program.dateEnd}
                programId={program.id}
                price={program.cardNo}
                level={program.title}
              />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 16,
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
  emptyScroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  emptyCard: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 16,
  },
  emptyIconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  emptyPhone: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
