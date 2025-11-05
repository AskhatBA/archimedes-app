import { StyleSheet } from 'react-native';

import { colors } from './colors';
import { fonts } from './fonts';

export const globalStyles = StyleSheet.create({
  sectionHeading: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 700,
    letterSpacing: 0,
    color: colors.textMain,
    fontFamily: fonts.SFPro.Bold,
  },
});
