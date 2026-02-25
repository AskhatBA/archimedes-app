import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { UserContextProvider } from '@/modules/user';
import { AuthContextProvider } from '@/shared/lib/auth';
import { OneSignalProvider } from '@/shared/lib/one-signal';
import { ToastProvider } from '@/shared/lib/toast';
import { NavigationProvider } from '@/shared/navigation';
import { ThemeProvider } from '@/shared/theme';

import { RootNavigator } from './navigation';

const queryClient = new QueryClient();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationProvider>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ToastProvider>
              <ThemeProvider>
                <AuthContextProvider>
                  <UserContextProvider>
                    <OneSignalProvider>
                      <StatusBar
                        barStyle="dark-content"
                        backgroundColor="white"
                        translucent={false}
                      />
                      <RootNavigator />
                    </OneSignalProvider>
                  </UserContextProvider>
                </AuthContextProvider>
              </ThemeProvider>
            </ToastProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </NavigationProvider>
    </SafeAreaProvider>
  );
}

export default App;
