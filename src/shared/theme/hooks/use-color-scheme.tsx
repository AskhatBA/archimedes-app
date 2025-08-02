import { useColorScheme as useNativeColorScheme } from 'react-native';

import { lightThemeColors, darkThemeColors } from '../colors';

export const useColorScheme = () => {
  const colorScheme = useNativeColorScheme();

  return {
    colors: colorScheme === 'dark' ? darkThemeColors : lightThemeColors,
  };
};
