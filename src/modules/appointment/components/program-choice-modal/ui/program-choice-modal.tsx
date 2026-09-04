import { FC, ReactNode, useEffect, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InsuranceProgram } from '@/api';
import { Button } from '@/shared/components/button';
import { BanknoteArrowDown, CloseIcon, ShieldPlusIcon } from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTranslation } from '@/shared/lib/i18n';
import { colors, fonts } from '@/shared/theme';

/** Marks the paid option apart from the programme ids it sits next to. */
const PAID_OPTION = 'PAID';

interface ProgramChoiceModalProps {
  visible: boolean;
  programs: InsuranceProgram[];
  /** Currently booked-under programme, if the patient already picked one. */
  selectedProgramId?: string;
  /**
   * Whether the patient has answered this choice at all. Tells a deliberate paid visit
   * apart from an untouched form, which starts on the first programme instead.
   */
  hasChosen: boolean;
  /** Called with the programme id, or `undefined` for a paid visit. */
  onSelect: (programId?: string) => void;
  onClose: () => void;
}

/**
 * Full-screen choice a patient with an insurance programme makes before filling the
 * booking form: which programme covers the visit, or none at all — a paid visit they
 * pay for per booking, exactly like a patient without any programme.
 */
export const ProgramChoiceModal: FC<ProgramChoiceModalProps> = ({
  visible,
  programs,
  selectedProgramId,
  hasChosen,
  onSelect,
  onClose,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  /**
   * What the dialog opens on: the programme the booking already uses, the paid option
   * once the patient has deliberately picked it, and otherwise the first programme —
   * the common case, so it is one tap away from confirmed.
   */
  const defaultOption = () => {
    if (selectedProgramId) return selectedProgramId;
    if (hasChosen) return PAID_OPTION;
    return programs[0]?.id || PAID_OPTION;
  };

  const [selected, setSelected] = useState<string>(defaultOption);

  // Reopening the choice starts from what the booking currently uses, not from the
  // option that happened to be highlighted the previous time.
  useEffect(() => {
    if (visible) setSelected(defaultOption());
  }, [visible, selectedProgramId, hasChosen, programs]);

  const renderOption = (
    key: string,
    icon: ReactNode,
    title: string,
    subtitle: string,
    caption?: string,
  ) => {
    const isSelected = selected === key;

    return (
      <TouchableOpacity
        key={key}
        activeOpacity={0.8}
        onPress={() => setSelected(key)}
        style={[
          styles.option,
          isSelected ? styles.optionSelected : styles.optionIdle,
        ]}
      >
        <View style={styles.optionIcon}>{icon}</View>
        <View style={styles.optionBody}>
          <Text style={styles.optionTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.optionSubtitle} numberOfLines={2}>
            {subtitle}
          </Text>
          {!!caption && <Text style={styles.optionCaption}>{caption}</Text>}
        </View>
        <View
          style={[
            styles.indicator,
            isSelected ? styles.indicatorSelected : styles.indicatorIdle,
          ]}
        >
          {isSelected && <View style={styles.indicatorDot} />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {t('appointments:create.programChoice.title')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            style={styles.close}
            hitSlop={8}
          >
            <CloseIcon width={22} height={22} color={colors.gray['600']} />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          {t('appointments:create.programChoice.subtitle')}
        </Text>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>
            {t('appointments:create.programChoice.programsSection')}
          </Text>
          <View style={styles.options}>
            {programs.map(program =>
              renderOption(
                program.id,
                <ShieldPlusIcon
                  width={22}
                  height={22}
                  color={colors.blue['400']}
                />,
                program.title,
                program.cardNo,
                program.dateEnd
                  ? t('appointments:create.programChoice.validUntil', {
                      date: formatDate(program.dateEnd, 'DD.MM.YYYY'),
                    })
                  : undefined,
              ),
            )}
          </View>

          <Text style={styles.sectionTitle}>
            {t('appointments:create.programChoice.paidSection')}
          </Text>
          <View style={styles.options}>
            {renderOption(
              PAID_OPTION,
              <BanknoteArrowDown
                width={22}
                height={22}
                color={colors.blue['400']}
              />,
              t('appointments:create.programChoice.paidTitle'),
              t('appointments:create.programChoice.paidSubtitle'),
            )}
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <Button
            onPress={() =>
              onSelect(selected === PAID_OPTION ? undefined : selected)
            }
          >
            {t('appointments:create.programChoice.submit')}
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundMain,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
  },
  title: {
    flex: 1,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    fontFamily: fonts.SFPro.Bold,
    color: colors.textMain,
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray['200'],
  },
  subtitle: {
    paddingHorizontal: 16,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['500'],
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    marginBottom: 10,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    color: colors.gray['500'],
  },
  options: {
    gap: 12,
    marginBottom: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionIdle: {
    backgroundColor: colors.gray['50'],
    borderColor: colors.gray['250'],
  },
  optionSelected: {
    backgroundColor: colors.blue['100'],
    borderColor: colors.blue['400'],
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue['150'],
  },
  optionBody: {
    flex: 1,
    gap: 2,
  },
  optionTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    fontFamily: fonts.SFPro.Semibold,
    color: colors.textMain,
  },
  optionSubtitle: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['500'],
  },
  optionCaption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.SFPro.Regular,
    color: colors.gray['500'],
  },
  indicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorIdle: {
    borderColor: colors.gray['300'],
  },
  indicatorSelected: {
    borderColor: colors.blue['400'],
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.blue['400'],
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray['200'],
  },
});
