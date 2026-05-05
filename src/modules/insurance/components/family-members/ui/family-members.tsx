import { FC, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ArrowBackIcon as CaretIcon, FamilyIcon } from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useFamily } from '@/shared/lib/insurance';
import { fonts, useTheme } from '@/shared/theme';

interface FamilyMembersProps {
  programId: string;
}

const getInitials = (fullName: string) =>
  fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');

const pluralizeMember = (n: number) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'человек';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return 'человека';
  }
  return 'человек';
};

export const FamilyMembers: FC<FamilyMembersProps> = ({ programId }) => {
  const [show, setShow] = useState(false);
  const { colors } = useTheme();
  const { family, loadingFamily } = useFamily(programId);

  if (loadingFamily) {
    return <ActivityIndicator color={colors.primary} />;
  }

  const count = family?.length ?? 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.gray['200'] }]}>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setShow(prevState => !prevState)}
        activeOpacity={0.7}
      >
        <View style={styles.triggerLeft}>
          <View
            style={[
              styles.triggerIcon,
              { backgroundColor: colors.blue['200'] },
            ]}
          >
            <FamilyIcon width={20} height={20} color={colors.blue['400']} />
          </View>
          <View style={styles.triggerTextWrap}>
            <Text style={[styles.triggerTitle, { color: colors.blue['500'] }]}>
              Прикрепленные члены семьи
            </Text>
            {count > 0 ? (
              <Text
                style={[styles.triggerCount, { color: colors.gray['500'] }]}
              >
                {count} {pluralizeMember(count)}
              </Text>
            ) : null}
          </View>
        </View>
        <CaretIcon
          style={{ transform: [{ rotate: show ? '90deg' : '-90deg' }] }}
        />
      </TouchableOpacity>

      {show && count > 0 && (
        <View style={styles.members}>
          {family?.map(member => (
            <View
              key={member.id}
              style={[
                styles.memberCard,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.blue['200'],
                },
              ]}
            >
              <View
                style={[styles.avatar, { backgroundColor: colors.blue['100'] }]}
              >
                <Text style={[styles.avatarText, { color: colors.primary }]}>
                  {getInitials(member.fullName)}
                </Text>
              </View>

              <View style={styles.memberInfo}>
                <Text
                  style={[styles.memberName, { color: colors.gray['700'] }]}
                  numberOfLines={2}
                >
                  {member.fullName}
                </Text>
                <Text
                  style={[styles.memberMeta, { color: colors.blue['500'] }]}
                  numberOfLines={1}
                >
                  {member.cardNo}
                </Text>
                <Text
                  style={[styles.memberMeta, { color: colors.gray['500'] }]}
                  numberOfLines={1}
                >
                  {formatDate(member.dateBirth, 'DD.MM.YYYY')}
                </Text>
              </View>

              {member.relationship ? (
                <View
                  style={[styles.pill, { backgroundColor: colors.blue['100'] }]}
                >
                  <Text style={[styles.pillText, { color: colors.primary }]}>
                    {member.relationship}
                  </Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  triggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  triggerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triggerTextWrap: {
    flexShrink: 1,
  },
  triggerTitle: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
  },
  triggerCount: {
    fontSize: 12,
    fontFamily: fonts.SFPro.Regular,
    marginTop: 2,
  },
  members: {
    gap: 8,
    paddingBottom: 16,
  },
  memberCard: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
  },
  memberInfo: {
    flex: 1,
    gap: 2,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
  },
  memberMeta: {
    fontSize: 12,
    fontFamily: fonts.SFPro.Regular,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
  },
});
