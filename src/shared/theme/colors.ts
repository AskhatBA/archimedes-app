const palette = {
  blue: {
    100: '#F0F6FC',
    150: '#D7E9F8',
    200: '#CEE2F1',
    400: '#19647F',
    500: '#295D87',
  },
  gray: {
    50: '#FEFFFF',
    200: '#F6F8F9',
    250: '#D4D4D4',
    300: '#BBC7D1',
    500: '#959595',
    600: '#424242',
    700: '#373737',
  },
  orange: {
    50: '#FDF8F1',
    100: '#F2E9DB',
    200: '#FCF1E2',
    300: '#F4DBBA',
    400: '#D4B897',
    600: '#CF8E52',
  },
  green: {
    100: '#F4F9E9',
    300: '#DBECCF',
    600: '#69914F',
  },
  white: '#FFFFFF',
};

export const lightThemeColors = {
  primary: palette.blue[500],
  textMain: palette.gray[700],
  backgroundMain: palette.white,
  ...palette,
};

export const darkThemeColors = lightThemeColors;

export const colors = lightThemeColors;
