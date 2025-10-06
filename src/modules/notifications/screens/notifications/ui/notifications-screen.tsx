import { FC } from 'react';
import { View, ScrollView } from 'react-native';

import { MainLayout } from '@/shared/layout/main-layout';

import { NotificationStack } from '../components/notification-stack';
import { Topbar } from '../components/topbar';
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
