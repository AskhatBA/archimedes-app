import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationProvider } from '@/shared/navigation';
import { ThemeProvider } from '@/shared/theme';

import { RootNavigator } from './navigation';

function App() {
  return (
    <SafeAreaProvider>
      <NavigationProvider>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </NavigationProvider>
    </SafeAreaProvider>
  );
}

export default App;
