import { FC } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { QrAppointmentItem } from '@/api/generated/data-contracts';
import { Button } from '@/shared/components/button';
import {
  CalendarIcon,
  ClipboardListIcon,
  HospitalIcon,
  SelectCaretIcon,
  StethoscopeIcon,
} from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTheme } from '@/shared/theme';

interface QrReferralCardProps {
  item: QrAppointmentItem;
  isExpanded: boolean;
  onPress: (id: number) => void;
  onConfirm: (id: number) => void;
}

const formatAmount = (amount?: number, currency?: string) => {
  if (amount == null) return '';
  const formatted = amount.toLocaleString('ru-RU');
  if (!currency) return formatted;
  return currency === 'KZT' ? `${formatted} ₸` : `${formatted} ${currency}`;
};

export const QrReferralCard: FC<QrReferralCardProps> = ({
  item,
  isExpanded,
  onPress,
  onConfirm,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => item.id != null && onPress(item.id)}
      style={[
        styles.card,
        { backgroundColor: colors.blue['100'], borderColor: colors.blue['200'] },
      ]}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.blue['150'] }]}>
          <ClipboardListIcon width={22} height={22} color={colors.blue['400']} />
        </View>
        <View style={styles.headerTexts}>
          {!!item.diagnosis && (
            <Text
              numberOfLines={isExpanded ? undefined : 2}
              style={[styles.diagnosis, { color: colors.blue['400'] }]}
            >
              {item.diagnosis}
            </Text>
          )}
        </View>
        <View style={[styles.chevron, isExpanded && styles.chevronExpanded]}>
          <SelectCaretIcon color={colors.blue['400']} />
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.blue['200'] }]} />

      <View style={styles.metaRows}>
        {!!item.date && (
          <View style={styles.metaRow}>
            <CalendarIcon width={16} height={16} color={colors.gray['500']} />
            <Text style={[styles.metaLabel, { color: colors.gray['500'] }]}>
              Дата выдачи
            </Text>
            <Text style={[styles.metaValue, { color: colors.textMain }]}>
              {formatDate(item.date, 'DD.MM.YYYY')}
            </Text>
          </View>
        )}

        {item.amount != null && (
          <View style={styles.metaRow}>
            <StethoscopeIcon width={16} height={16} color={colors.blue['400']} />
            <Text style={[styles.metaLabel, { color: colors.gray['500'] }]}>
              Итого
            </Text>
            <Text style={[styles.totalValue, { color: colors.blue['400'] }]}>
              {formatAmount(item.amount, item.currency)}
            </Text>
          </View>
        )}
      </View>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <View
            style={[styles.divider, { backgroundColor: colors.blue['200'] }]}
          />

          {!!item.name && (
            <View style={styles.metaRow}>
              <Text style={[styles.metaLabel, { color: colors.gray['500'] }]}>
                Пациент
              </Text>
              <Text
                style={[styles.metaValue, { color: colors.textMain }]}
                numberOfLines={2}
              >
                {item.name}
              </Text>
            </View>
          )}

          {!!item.medical_institution && (
            <View style={styles.institutionRow}>
              <HospitalIcon width={14} height={14} color={colors.blue['500']} />
              <Text
                numberOfLines={3}
                style={[styles.institutionText, { color: colors.gray['600'] }]}
              >
                {item.medical_institution}
              </Text>
            </View>
          )}

          {(item.appointmentDetail?.length ?? 0) > 0 && (
            <View
              style={[
                styles.servicesBlock,
                { backgroundColor: colors.gray['200'] },
              ]}
            >
              <Text
                style={[styles.sectionLabel, { color: colors.gray['600'] }]}
              >
                Услуги
              </Text>
              {item.appointmentDetail!.map(detail => (
                <View key={detail.id} style={styles.serviceRow}>
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
                      style={[
                        styles.serviceAmount,
                        { color: colors.gray['600'] },
                      ]}
                    >
                      {formatAmount(detail.amount, item.currency)}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <View style={[styles.divider, { backgroundColor: colors.blue['200'] }]} />

      <Button size="sm" onPress={() => item.id != null && onConfirm(item.id)}>
        Подтвердить
      </Button>
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
  },
  diagnosis: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
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
  totalValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'right',
  },
  expandedContent: {
    gap: 14,
  },
  institutionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  institutionText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 17,
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
});
