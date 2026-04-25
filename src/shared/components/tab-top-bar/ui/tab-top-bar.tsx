import { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GreetUser } from '@/shared/components/greet-user';
import { TabBarNotificationsIcon } from '@/shared/icons';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

interface TabTopBarProps {
  variant?: 'greeting' | 'title';
  title?: string;
}

const TitleRow: FC<{ title?: string }> = ({ title }) => {
  const { navigate } = useNavigation();
  return (
    <View style={styles.row}>
      <Text style={styles.titleText}>{title}</Text>
      <TouchableOpacity
        onPress={() => navigate(routes.Notifications)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <TabBarNotificationsIcon
          color={colors.primary}
          width={28}
          height={28}
        />
      </TouchableOpacity>
    </View>
  );
};

export const TabTopBar: FC<TabTopBarProps> = ({ variant = 'title', title }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 4 }]}>
      {variant === 'greeting' ? <GreetUser /> : <TitleRow title={title} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray['200'],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: fonts.SFPro.Bold,
  },
});
