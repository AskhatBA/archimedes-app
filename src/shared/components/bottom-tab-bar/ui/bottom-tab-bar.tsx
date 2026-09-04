import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Fragment, FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/shared/theme';

import { NavigationRoute } from '../types';

import { QrScanButton } from './qr-scan-button';
import { TabBarItem } from './tab-bar-item';

export const BottomTabBar: FC<BottomTabBarProps> = ({
  state,
  insets,
  navigation,
}) => {
  const qrButtonIndex = Math.floor(state.routes.length / 2);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => (
        <Fragment key={route.key}>
          {index === qrButtonIndex && <QrScanButton />}
          <TabBarItem
            route={route as NavigationRoute}
            tabIndex={index}
            navigation={navigation}
            state={state}
          />
        </Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingHorizontal: 0,
    borderTopColor: colors.gray['200'],
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
});
