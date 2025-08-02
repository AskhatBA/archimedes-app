import {
  createContext,
  useContext,
  useState,
  FC,
  ReactNode,
  useMemo,
} from 'react';

import { darkThemeColors, lightThemeColors } from '../colors';

interface ThemeContextValues {
  colors: typeof lightThemeColors;
  scheme: ThemeSchemasType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValues>(null);

const ThemeSchemas = { Light: 'light', Dark: 'dark' };
type ThemeSchemasType = (typeof ThemeSchemas)[keyof typeof ThemeSchemas];

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [scheme, setScheme] = useState<ThemeSchemasType>(ThemeSchemas.Light);

  const toggleTheme = () =>
    setScheme(prev =>
      prev === ThemeSchemas.Light ? ThemeSchemas.Dark : ThemeSchemas.Light,
    );

  const colors = scheme === 'dark' ? darkThemeColors : lightThemeColors;

  const values = useMemo(() => ({ colors, scheme, toggleTheme }), [scheme]);

  return (
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
