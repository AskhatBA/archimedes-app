import { FC, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { StethoscopeIcon } from '@/shared/icons';
import { routes, useNavigation } from '@/shared/navigation';
import { colors, fonts } from '@/shared/theme';

interface ActionTileProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  backgroundColor: string;
  titleColor: string;
  subtitleColor?: string;
  onPress: () => void;
  large?: boolean;
}

const ActionTile: FC<ActionTileProps> = ({
  title,
  subtitle,
  icon,
  backgroundColor,
  titleColor,
  subtitleColor,
  onPress,
  large,
}) => (
  <TouchableOpacity
    style={[
      styles.tile,
      { backgroundColor },
      large ? styles.tileLarge : styles.tileSmall,
    ]}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <View style={styles.tileText}>
      <Text style={[styles.tileTitle, { color: titleColor }]}>{title}</Text>
      {subtitle ? (
        <Text style={[styles.tileSubtitle, { color: subtitleColor }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
    <View style={large ? styles.iconBoxLarge : styles.iconBoxSmall}>
      {icon}
    </View>
  </TouchableOpacity>
);

export const QuickActions: FC = () => {
  const { navigate } = useNavigation();

  return (
    <ActionTile
      title="Записаться на прием"
      icon={
        <StethoscopeIcon width={48} height={48} color={colors.blue['400']} />
      }
      backgroundColor={colors.blue['150']}
      titleColor={colors.blue['500']}
      subtitleColor={colors.blue['400']}
      onPress={() => navigate(routes.CreateAppointment)}
      large
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.gray['200'],
    borderRadius: 24,
    padding: 12,
  },
  column: {
    flex: 1,
    gap: 10,
  },
  tile: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: 'space-between',
  },
  tileLarge: {
    flex: 1,
    flexDirection: 'row',
  },
  tileSmall: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 80,
  },
  tileText: {
    flexShrink: 1,
  },
  tileTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
  },
  tileSubtitle: {
    fontSize: 13,
    lineHeight: 16,
    marginTop: 4,
    fontFamily: fonts.SFPro.Medium,
    fontWeight: '500',
  },
  iconBoxLarge: {},
  iconBoxSmall: {
    marginLeft: 'auto',
  },
});
