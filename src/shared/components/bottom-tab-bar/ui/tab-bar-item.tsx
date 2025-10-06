import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FC } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { colors } from '@/shared/theme';

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
  const { Icon } = navigationItems[route.name];

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
      style={{ flex: 1, alignItems: 'center' }}
      onPress={onTabPress}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isActive ? colors.blue[100] : colors.gray[200] },
        ]}
      >
        <Icon color={isActive ? colors.primary : colors.gray[300]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    height: 45,
    borderRadius: 45,
  },
});
