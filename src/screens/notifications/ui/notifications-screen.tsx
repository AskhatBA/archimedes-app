import { FC } from 'react';
import { View, ScrollView } from 'react-native';

import { Topbar, NotificationStack } from '@/modules/notifications';
import { MainLayout } from '@/shared/layout/main-layout';

import { notifications } from '../data';

export const NotificationsScreen: FC = () => {
  return (
    <ScrollView>
      <MainLayout>
        <View>
          <Topbar />
          <NotificationStack notifications={notifications} />
        </View>
      </MainLayout>
    </ScrollView>
  );
};
