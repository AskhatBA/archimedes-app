import { FC, useState } from 'react';
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import { ElectronicReferralItem } from '@/api';
import { Button } from '@/shared/components/button';
import { Radio } from '@/shared/components/radio';
import { useTheme } from '@/shared/theme';

import { REFERRAL_OPTIONS } from '../../../constants';
import { useElectronicReferralStatusUpdate } from '../../../hooks/use-electronic-referral-status-update';

interface ElectronicReferralCardProps {
  electronicReferralItem: ElectronicReferralItem;
  onCardPress?: (electronicReferralId: number) => void;
  isExpanded?: boolean;
}

export const ElectronicReferralCard: FC<ElectronicReferralCardProps> = ({
  electronicReferralItem,
  onCardPress,
  isExpanded,
}) => {
  const { updateElectronicReferralStatus, isLoading } =
    useElectronicReferralStatusUpdate();
  const { colors } = useTheme();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  return (
    <TouchableOpacity
      onPress={() => onCardPress?.(electronicReferralItem.id)}
      style={[
        styles.card,
        {
          backgroundColor: colors.gray['200'],
          borderColor: colors.gray['300'],
        },
      ]}
    >
      {!!electronicReferralItem.date && (
        <Text style={[styles.date, { color: colors.gray['500'] }]}>
          {electronicReferralItem.date}
        </Text>
      )}

      {!!electronicReferralItem.name && (
        <Text style={[styles.title, { color: colors.textMain }]}>
          {electronicReferralItem.name}
        </Text>
      )}

      {!!electronicReferralItem.medical_institution && (
        <Text style={[styles.subtitle, { color: colors.gray['500'] }]}>
          {electronicReferralItem.medical_institution}
        </Text>
      )}

      {!!electronicReferralItem.diagnosis && (
        <Text style={[styles.subtitle, { color: colors.gray['500'] }]}>
          Диагноз: {electronicReferralItem.diagnosis}
        </Text>
      )}

      {(electronicReferralItem.amount != null ||
        electronicReferralItem.currency) && (
        <Text style={[styles.amount, { color: colors.primary }]}>
          {electronicReferralItem.amount != null
            ? electronicReferralItem.amount
            : ''}
          {electronicReferralItem.currency
            ? ` ${electronicReferralItem.currency}`
            : ''}
        </Text>
      )}

      {!!electronicReferralItem.appointmentDetail?.length && (
        <View style={{ marginTop: 8, gap: 4 }}>
          {electronicReferralItem.appointmentDetail.map(detail => (
            <Text
              key={`${electronicReferralItem.id}-${detail.id}-${detail.service}`}
              style={{ color: colors.gray['500'], fontSize: 12 }}
            >
              {detail.service}
              {detail.amount != null ? ` — ${detail.amount}` : ''}
            </Text>
          ))}
        </View>
      )}

      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={[styles.instructionText, { color: colors.textMain }]}>
            Направление считается действительным в течение 10 дней с даты
            выписки
          </Text>

          <View style={styles.radioGroup}>
            {REFERRAL_OPTIONS.map(option => (
              <Pressable
                key={option.id}
                style={styles.radioItem}
                onPress={() => setSelectedOption(option.id)}
              >
                <Radio
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  value={`${option.id}`}
                />
                <Text style={[styles.radioLabel, { color: colors.primary }]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
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
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  date: {
    fontSize: 12,
  },
  title: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
  },
  amount: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  expandedContent: {
    marginTop: 16,
  },
  radioGroup: {
    gap: 16,
    marginBottom: 20,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioLabel: {
    fontSize: 14,
  },
  confirmButton: {
    paddingVertical: 12,
  },
  instructionText: {
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
    lineHeight: 18,
  },
});
