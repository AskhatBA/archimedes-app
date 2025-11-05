import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, fonts } from '@/shared/theme';

import { navigationItems } from '../constants';
import { NavigationRoute } from '../types';

interface TabBarItemProps {
  tabIndex: number;
  state: BottomTabBarProps['state'];
  navigation: BottomTabBarProps['navigation'];
  route: NavigationRoute;
}

export const TabBarItem: FC<TabBarItemProps> = ({
  route,
  state,
  tabIndex,
  navigation,
}) => {
  const isActive = state.index === tabIndex;
  const { Icon, label } = navigationItems[route.name];

  const onTabPress = (): void => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isActive && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  return (
    <TouchableOpacity
      style={{ flex: 1, alignItems: 'center', gap: 4 }}
      onPress={onTabPress}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isActive ? colors.blue[100] : colors.gray[200] },
        ]}
      >
        <Icon
          width={26}
          height={26}
          color={isActive ? colors.primary : colors.gray[300]}
        />
      </View>
      <Text
        style={[
          styles.label,
          {
            color: isActive ? colors.primary : colors.blue['370'],
            fontWeight: isActive ? 700 : 600,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 45,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
    fontFamily: fonts.SFPro.Regular,
  },
});
