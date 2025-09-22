import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/shared/theme';

import { NavigationRoute } from '../types';

import { TabBarItem } from './tab-bar-item';

export const BottomTabBar: FC<BottomTabBarProps> = ({
  state,
  insets,
  navigation,
}) => {
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => (
        <TabBarItem
          key={route.key}
          route={route as NavigationRoute}
          tabIndex={index}
          navigation={navigation}
          state={state}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopColor: colors.gray['200'],
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
});
