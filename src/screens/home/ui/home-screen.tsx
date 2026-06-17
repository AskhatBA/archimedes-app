import { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { News } from '@/modules/insurance';
import { colors } from '@/shared/theme';

import { HomeTopbar } from './home-topbar';
import { ProfileCard } from './profile-card';
import { QuickActions } from './quick-actions';
import { ReferralsBlock } from './referrals-block';

export const HomeScreen: FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.wrapper}>
      <HomeTopbar />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileCard />
        <QuickActions />
        <ReferralsBlock />
        <News />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 14,
  },
});
