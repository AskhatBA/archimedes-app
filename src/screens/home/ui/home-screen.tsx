import { FC, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { News } from '@/modules/insurance';
import { colors } from '@/shared/theme';

import { AppointmentsCard } from './appointments-card';
import { CallCenterCard } from './call-center-card';
import { CatalogBanners } from './catalog-banners';
import { HomeTopbar } from './home-topbar';
import { MedAccountCard } from './med-account-card';
import { ProfileCard } from './profile-card';
import { ProgramsCard } from './programs-card';
import { QuickActions } from './quick-actions';
import { QuickAuthPrompt } from './quick-auth-prompt';

export const HomeScreen: FC = () => {
  const insets = useSafeAreaInsets();
  const [scrolled, setScrolled] = useState(false);

  return (
    <View style={styles.wrapper}>
      <HomeTopbar scrolled={scrolled} />
      <ScrollView
        onScroll={({ nativeEvent }) =>
          setScrolled(nativeEvent.contentOffset.y > 4)
        }
        scrollEventThrottle={32}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ProfileCard />
        <ProgramsCard />
        <AppointmentsCard />
        <MedAccountCard />
        <QuickActions />
        <CallCenterCard />
        <CatalogBanners />
        <News />
      </ScrollView>
      <QuickAuthPrompt />
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
