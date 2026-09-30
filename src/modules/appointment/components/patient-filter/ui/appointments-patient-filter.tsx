import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import {
  CloseIcon,
  FamilyIcon,
  SelectCaretIcon,
  SelectIndicator,
  UserFilledIcon,
} from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

import { useFamilyMembers } from '../../../hooks/use-family-members';
import {
  FamilyMember,
  initialsOf,
  shortNameOf,
} from '../../../lib/family-members';
import { AppointmentsPatient } from '../../../types';

interface AppointmentsPatientFilterProps {
  value: AppointmentsPatient;
  onChange: (value: AppointmentsPatient) => void;
}

/**
 * Warm tones for relatives, so a list that is not the patient's own never looks like it:
 * blue stays the patient's and the clinic's colour everywhere else in the app.
 */
const RELATIVE_TONES = [
  { background: colors.gold['100'], text: colors.gold['700'] },
  { background: colors.green['200'], text: colors.green['600'] },
  { background: colors.orange['300'], text: colors.gold['700'] },
];

const toneOf = (index: number) => RELATIVE_TONES[index % RELATIVE_TONES.length];

/** How many faces the collapsed row shows before folding the rest into "+N". */
const FACEPILE_SIZE = 3;

const Avatar: FC<{
  member: FamilyMember;
  index: number;
  size: number;
  ring?: string;
}> = ({ member, index, size, ring }) => {
  const tone = toneOf(index);

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: tone.background,
        },
        ring ? { borderWidth: 2, borderColor: ring } : null,
      ]}
    >
      <Text
        style={[
          styles.avatarInitials,
          { color: tone.text, fontSize: Math.round(size * 0.36) },
        ]}
      >
        {initialsOf(member.fullName)}
      </Text>
    </View>
  );
};

const OwnAvatar: FC<{ size: number }> = ({ size }) => (
  <View
    style={[
      styles.avatar,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.blue['150'],
      },
    ]}
  >
    <UserFilledIcon
      width={size * 0.45}
      height={size * 0.45}
      color={colors.blue['400']}
    />
  </View>
);

const PatientOption: FC<{
  avatar: ReactNode;
  title: string;
  meta: string;
  selected: boolean;
  onPress: () => void;
}> = ({ avatar, title, meta, selected, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[styles.option, selected && styles.optionSelected]}
    accessibilityRole="radio"
    accessibilityState={{ checked: selected }}
  >
    {avatar}
    <View style={styles.optionText}>
      <Text
        style={[styles.optionTitle, selected && styles.optionTitleSelected]}
        numberOfLines={1}
      >
        {title}
      </Text>
      {!!meta && (
        <Text style={styles.optionMeta} numberOfLines={1}>
          {meta}
        </Text>
      )}
    </View>
    <View style={styles.optionCheck}>
      {selected && (
        <SelectIndicator width={24} height={24} color={colors.blue['400']} />
      )}
    </View>
  </TouchableOpacity>
);

/**
 * Picks whose appointments the screen lists: the patient's own, or a relative's.
 *
 * Collapsed to one row by default — most visits are the patient's own, and the choice
 * should not push the list down for everyone. The row shows the family as a stack of
 * initials, so it is plain at a glance that there is someone to switch to; once a
 * relative is picked the row becomes that relative, with a cross straight back to the
 * patient's own list, so a list that is not theirs never passes for it.
 *
 * The choice itself is a sheet, like every other picker in the app, with one row per
 * person: a single tap picks the relative and the programme they are on together. Hidden
 * when there is nobody to pick.
 */
export const AppointmentsPatientFilter: FC<AppointmentsPatientFilterProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation();
  const { members, programTitles, isLoading } = useFamilyMembers();
  const [isOpen, setIsOpen] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  const pickedIndex = members.findIndex(
    member => member.benId === value.familyMemberId,
  );
  const picked = pickedIndex >= 0 ? members[pickedIndex] : undefined;
  const isVisible = members.length > 0;

  // A relative who has since left the policy cannot be read any more; rather than an
  // empty list under their name, fall back to the patient's own.
  useEffect(() => {
    if (!isLoading && value.familyMemberId && !picked) onChange({});
  }, [isLoading, value.familyMemberId, picked, onChange]);

  // The row fades in when it first appears (the family loads after the screen) and
  // again whenever it switches to someone else, so the change of list is noticed.
  useEffect(() => {
    if (!isVisible) return;
    fade.setValue(0);
    Animated.timing(fade, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [fade, isVisible, value.familyMemberId]);

  if (!isVisible) return null;

  const metaOf = (member: FamilyMember) =>
    [
      member.relationship,
      member.birthDate ? formatDate(member.birthDate, 'DD.MM.YYYY') : '',
    ]
      .filter(Boolean)
      .join(' · ');

  const pick = (next: AppointmentsPatient) => {
    setIsOpen(false);
    if (next.familyMemberId !== value.familyMemberId) onChange(next);
  };

  const hiddenFaces = members.length - FACEPILE_SIZE;

  return (
    <>
      <Animated.View style={[styles.container, { opacity: fade }]}>
        {picked ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setIsOpen(true)}
            style={[styles.trigger, styles.triggerRelative]}
            accessibilityRole="button"
            accessibilityHint={t('appointments:patientFilter.title')}
          >
            <Avatar member={picked} index={pickedIndex} size={40} />
            <View style={styles.triggerText}>
              <Text style={styles.eyebrow} numberOfLines={1}>
                {t('appointments:patientFilter.relativeHint')}
              </Text>
              <Text style={styles.triggerTitle} numberOfLines={1}>
                {shortNameOf(picked.fullName)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onChange({})}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={styles.reset}
              accessibilityRole="button"
              accessibilityLabel={t('appointments:patientFilter.reset')}
            >
              <CloseIcon width={16} height={16} color={colors.gold['700']} />
            </TouchableOpacity>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setIsOpen(true)}
            style={[styles.trigger, styles.triggerOwn]}
            accessibilityRole="button"
            accessibilityHint={t('appointments:patientFilter.title')}
          >
            <View style={styles.triggerText}>
              <Text style={styles.triggerTitle}>
                {t('appointments:patientFilter.self')}
              </Text>
              <Text style={styles.triggerHint} numberOfLines={1}>
                {t('appointments:patientFilter.selfHint')}
              </Text>
            </View>
            <View style={styles.facepile}>
              {members.slice(0, FACEPILE_SIZE).map((member, index) => (
                <View
                  key={member.benId}
                  style={index > 0 ? styles.facepileOverlap : null}
                >
                  <Avatar
                    member={member}
                    index={index}
                    size={30}
                    ring={colors.orange['50']}
                  />
                </View>
              ))}
              {hiddenFaces > 0 && (
                <View style={[styles.facepileOverlap, styles.facepileMore]}>
                  <Text style={styles.facepileMoreText}>+{hiddenFaces}</Text>
                </View>
              )}
            </View>
            <View style={styles.chevron}>
              <SelectCaretIcon color={colors.gold['700']} />
            </View>
          </TouchableOpacity>
        )}
      </Animated.View>

      <BottomDrawer
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        scrollable={members.length > 4}
      >
        <View style={styles.sheet}>
          <View style={styles.sheetIcon}>
            <FamilyIcon width={24} height={24} color={colors.gold['700']} />
          </View>
          <Text style={styles.sheetTitle}>
            {t('appointments:patientFilter.title')}
          </Text>
          <Text style={styles.sheetSubtitle}>
            {t('appointments:patientFilter.subtitle')}
          </Text>

          <View style={styles.options}>
            <PatientOption
              avatar={<OwnAvatar size={44} />}
              title={t('appointments:patientFilter.self')}
              meta={t('appointments:patientFilter.selfDescription')}
              selected={!picked}
              onPress={() => pick({})}
            />
            {members.map((member, index) => (
              <PatientOption
                key={member.benId}
                avatar={<Avatar member={member} index={index} size={44} />}
                title={member.fullName}
                meta={metaOf(member)}
                selected={member.benId === picked?.benId}
                onPress={() =>
                  pick({
                    programId: member.programId,
                    familyMemberId: member.benId,
                  })
                }
              />
            ))}
          </View>

          {programTitles.length > 0 && (
            <Text style={styles.footnote}>
              {t('appointments:patientFilter.programs', {
                list: programTitles.join(', '),
              })}
            </Text>
          )}
        </View>
      </BottomDrawer>
    </>
  );
};

const styles = StyleSheet.create({
  // Full bleed, like the "История записей" card above it.
  container: {
    marginHorizontal: -16,
    marginBottom: 16,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 64,
  },
  triggerOwn: {
    backgroundColor: colors.orange['50'],
    borderColor: colors.orange['100'],
  },
  triggerRelative: {
    backgroundColor: colors.orange['200'],
    borderColor: colors.orange['300'],
  },
  triggerText: {
    flex: 1,
    gap: 2,
  },
  triggerTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.textMain,
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.gold['700'],
  },
  triggerHint: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '500',
    color: colors.gold['700'],
  },
  facepile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facepileOverlap: {
    marginLeft: -9,
  },
  facepileMore: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.orange['50'],
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facepileMoreText: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.gold['700'],
  },
  chevron: {
    transform: [{ rotate: '-90deg' }],
  },
  reset: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    letterSpacing: 0.5,
  },
  sheet: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  sheetIcon: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gold['100'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.textMain,
    textAlign: 'center',
  },
  sheetSubtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['600'],
    textAlign: 'center',
  },
  options: {
    marginTop: 20,
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gray['200'],
    backgroundColor: colors.gray['200'],
  },
  optionSelected: {
    borderColor: colors.blue['200'],
    backgroundColor: colors.blue['100'],
  },
  optionText: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    color: colors.textMain,
  },
  optionTitleSelected: {
    color: colors.blue['400'],
  },
  optionMeta: {
    fontSize: 13,
    lineHeight: 17,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['500'],
  },
  optionCheck: {
    width: 24,
    height: 24,
  },
  footnote: {
    marginTop: 16,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['500'],
    textAlign: 'center',
  },
});
