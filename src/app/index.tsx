import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthContextProvider } from '@/shared/lib/auth';
import { ToastProvider } from '@/shared/lib/toast';
import { UserContextProvider } from '@/shared/lib/user';
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
                    <StatusBar
                      barStyle="dark-content"
                      backgroundColor="white"
                      translucent={false}
                    />
                    <RootNavigator />
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
