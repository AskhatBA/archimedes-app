import { FC, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ElectronicReferralItem } from '@/api';
import { Button } from '@/shared/components/button';
import { Radio } from '@/shared/components/radio';
import {
  CalendarIcon,
  ClipboardListIcon,
  HospitalIcon,
  SelectCaretIcon,
  StethoscopeIcon,
} from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTheme } from '@/shared/theme';

import { REFERRAL_OPTIONS } from '../../../constants';
import { useElectronicReferralStatusUpdate } from '../../../hooks/use-electronic-referral-status-update';

interface ElectronicReferralCardProps {
  electronicReferralItem: ElectronicReferralItem;
  onCardPress?: (electronicReferralId: number) => void;
  isExpanded?: boolean;
}

const formatAmount = (amount?: number, currency?: string) => {
  if (amount == null) return '';
  const formatted = amount.toLocaleString('ru-RU');
  if (!currency) return formatted;
  return currency === 'KZT' ? `${formatted} ₸` : `${formatted} ${currency}`;
};

export const ElectronicReferralCard: FC<ElectronicReferralCardProps> = ({
  electronicReferralItem,
  onCardPress,
  isExpanded,
}) => {
  const { updateElectronicReferralStatus, isLoading } =
    useElectronicReferralStatusUpdate();
  const { colors } = useTheme();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const totalAmount = formatAmount(
    electronicReferralItem.amount,
    electronicReferralItem.currency,
  );

  const services = electronicReferralItem.appointmentDetail ?? [];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() =>
        electronicReferralItem.id != null &&
        onCardPress?.(electronicReferralItem.id)
      }
      style={[
        styles.card,
        {
          backgroundColor: colors.blue['100'],
          borderColor: colors.blue['200'],
        },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.blue['150'] }]}>
          <ClipboardListIcon
            width={22}
            height={22}
            color={colors.blue['400']}
          />
        </View>
        <View style={styles.headerTexts}>
          {!!electronicReferralItem.name && (
            <Text
              numberOfLines={2}
              style={[styles.title, { color: colors.blue['400'] }]}
            >
              {electronicReferralItem.name}
            </Text>
          )}
          {!!electronicReferralItem.medical_institution && (
            <View style={styles.headerInfoRow}>
              <HospitalIcon width={14} height={14} color={colors.blue['500']} />
              <Text
                numberOfLines={2}
                style={[styles.headerSubtitle, { color: colors.gray['600'] }]}
              >
                {electronicReferralItem.medical_institution}
              </Text>
            </View>
          )}
        </View>
        <View style={[styles.chevron, isExpanded && styles.chevronExpanded]}>
          <SelectCaretIcon color={colors.blue['400']} />
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.blue['200'] }]} />

      <View style={styles.metaRows}>
        {!!electronicReferralItem.date && (
          <View style={styles.metaRow}>
            <CalendarIcon width={16} height={16} color={colors.gray['500']} />
            <Text style={[styles.metaLabel, { color: colors.gray['500'] }]}>
              Дата выдачи
            </Text>
            <Text style={[styles.metaValue, { color: colors.textMain }]}>
              {formatDate(electronicReferralItem.date, 'DD.MM.YYYY')}
            </Text>
          </View>
        )}

        {!!electronicReferralItem.diagnosis && (
          <View style={styles.metaRow}>
            <StethoscopeIcon
              width={16}
              height={16}
              color={colors.blue['400']}
            />
            <Text style={[styles.metaLabel, { color: colors.gray['500'] }]}>
              Диагноз
            </Text>
            <Text
              numberOfLines={2}
              style={[styles.metaValue, { color: colors.textMain }]}
            >
              {electronicReferralItem.diagnosis}
            </Text>
          </View>
        )}
      </View>

      {services.length > 0 && (
        <View
          style={[
            styles.servicesBlock,
            { backgroundColor: colors.gray['200'] },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: colors.gray['600'] }]}>
            Услуги
          </Text>
          {services.map(detail => (
            <View
              key={`${electronicReferralItem.id}-${detail.id}-${detail.service}`}
              style={styles.serviceRow}
            >
              <View
                style={[
                  styles.serviceDot,
                  { backgroundColor: colors.blue['400'] },
                ]}
              />
              <Text
                style={[styles.serviceName, { color: colors.textMain }]}
                numberOfLines={2}
              >
                {detail.service}
              </Text>
              {detail.amount != null && (
                <Text
                  style={[styles.serviceAmount, { color: colors.gray['600'] }]}
                >
                  {formatAmount(detail.amount, electronicReferralItem.currency)}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {!!totalAmount && (
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.gray['600'] }]}>
            Итого
          </Text>
          <Text style={[styles.totalValue, { color: colors.blue['400'] }]}>
            {totalAmount}
          </Text>
        </View>
      )}

      {isExpanded && (
        <View style={styles.expandedContent}>
          <View
            style={[styles.divider, { backgroundColor: colors.blue['200'] }]}
          />

          <Text style={[styles.instructionText, { color: colors.gray['600'] }]}>
            Направление считается действительным в течение 10 дней с даты
            выписки
          </Text>

          <View style={styles.radioGroup}>
            {REFERRAL_OPTIONS.map(option => {
              const isSelected = selectedOption === option.id;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => setSelectedOption(option.id)}
                  style={[
                    styles.radioItem,
                    {
                      backgroundColor: isSelected
                        ? colors.blue['150']
                        : colors.gray['200'],
                      borderColor: isSelected
                        ? colors.blue['400']
                        : 'transparent',
                    },
                  ]}
                >
                  <Radio
                    checked={isSelected}
                    onChange={() => setSelectedOption(option.id)}
                    value={`${option.id}`}
                  />
                  <Text
                    style={[
                      styles.radioLabel,
                      {
                        color: isSelected
                          ? colors.blue['400']
                          : colors.textMain,
                        fontWeight: isSelected ? '600' : '500',
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Button
            style={styles.confirmButton}
            onPress={() =>
              updateElectronicReferralStatus({
                electronicReferralId: `${electronicReferralItem.id}`,
                status: selectedOption,
              })
            }
            isLoading={isLoading}
            disabled={typeof selectedOption !== 'number'}
          >
            Подтвердить
          </Button>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerTexts: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
  },
  headerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerSubtitle: {
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
  },
  chevron: {
    paddingTop: 4,
  },
  chevronExpanded: {
    transform: [{ rotate: '180deg' }],
  },
  divider: {
    height: 1,
    width: '100%',
  },
  metaRows: {
    gap: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: '400',
  },
  metaValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'right',
  },
  servicesBlock: {
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  serviceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  serviceName: {
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
  },
  serviceAmount: {
    fontSize: 13,
    fontWeight: '600',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  expandedContent: {
    gap: 14,
  },
  instructionText: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  radioGroup: {
    gap: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  radioLabel: {
    fontSize: 14,
  },
  confirmButton: {
    paddingVertical: 12,
  },
});
