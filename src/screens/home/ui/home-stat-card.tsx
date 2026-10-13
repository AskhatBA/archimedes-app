import { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { SelectCaretIcon } from '@/shared/icons';
import { colors, fonts } from '@/shared/theme';

export const ChevronRight: FC<{ color?: string; size?: number }> = ({
  color = colors.blue['400'],
  size = 14,
}) => (
  <View style={{ transform: [{ rotate: '-90deg' }] }}>
    <SelectCaretIcon width={size} height={size} color={color} />
  </View>
);

/** The layout shared by the programmes and appointments cards on the home screen. */
export const statCardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.blue['100'],
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.blue['200'],
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    opacity: 0.6,
    color: colors.blue['400'],
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
  badge: {
    marginLeft: 'auto',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
  body: {
    gap: 6,
  },
  title: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.blue['500'],
    fontFamily: fonts.SFPro.Bold,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 18,
    opacity: 0.75,
    color: colors.blue['500'],
    fontFamily: fonts.SFPro.Medium,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginTop: 4,
    opacity: 0.7,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  meta: {
    flexShrink: 1,
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.65,
    fontFamily: fonts.SFPro.Regular,
  },
  emptyValue: {
    fontSize: 15,
    lineHeight: 18,
    color: colors.blue['500'],
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ctaText: {
    fontSize: 13,
    lineHeight: 16,
    color: colors.green['600'],
    fontFamily: fonts.SFPro.Semibold,
    fontWeight: '600',
  },
});
