import { FC, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

import { useMedicalTests } from '@/modules/medical-tests';
import { BottomDrawer } from '@/shared/components/bottom-drawer';
import {
  SelectCaretIcon,
  ClipboardListIcon,
  FileTextIcon,
} from '@/shared/icons';
import { formatDate } from '@/shared/lib/date';
import { useTheme } from '@/shared/theme';

import { HistoryCard } from './history-card';

import type { MISLaboratoryResult } from '@/api/generated/data-contracts';

export const MyTests: FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MISLaboratoryResult | null>(null);
  const { colors } = useTheme();
  const { medicalTests } = useMedicalTests();

  const testsCount = medicalTests?.length || 0;

  const headerBg = open ? colors.orange['50'] : colors.gray['200'];
  const headerBorder = open ? colors.orange['300'] : colors.gray['250'];
  const headerText = open ? colors.orange['600'] : colors.gray['700'];
  const badgeBg = open ? colors.orange['600'] : colors.gray['300'];
  const badgeIcon = open ? colors.white : colors.gray['700'];
  const caretColor = open ? colors.orange['600'] : colors.gray['700'];

  const onOpenTest = (test: MISLaboratoryResult) => setSelected(test);
  const closeDrawer = () => setSelected(null);

  const openPdf = async (fileName: string, base64?: string) => {
    try {
      if (!base64) {
        Alert.alert('Ошибка', 'PDF недоступен');
        return;
      }

      // Some APIs return: "data:application/pdf;base64,...."
      const cleanedBase64 = base64.replace(
        /^data:application\/pdf;base64,/,
        '',
      );

      // Android is picky about filename characters
      const safeName = fileName.replace(/[^\w.-]+/g, '_');

      const dir =
        Platform.OS === 'android'
          ? RNFS.CachesDirectoryPath
          : RNFS.DocumentDirectoryPath;

      const path = `${dir}/${safeName}.pdf`;

      await RNFS.writeFile(path, cleanedBase64, 'base64');

      await (FileViewer as any).open(path, {
        showOpenWithDialog: true,
      });
    } catch (e) {
      console.log('file upload error: ', e.toString());
      Alert.alert('Ошибка', 'Не удалось открыть PDF');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setOpen(prev => !prev)}
        style={[
          styles.fieldContainer,
          { backgroundColor: headerBg, borderColor: headerBorder },
        ]}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <View style={[styles.headerBadge, { backgroundColor: badgeBg }]}>
          <ClipboardListIcon color={badgeIcon} width={20} height={20} />
        </View>
        <View style={styles.headerTexts}>
          <Text style={[styles.headerEyebrow, { color: colors.gray['500'] }]}>
            Лаборатория
          </Text>
          <Text numberOfLines={1} style={[styles.value, { color: headerText }]}>
            Мои анализы
          </Text>
          <Text style={[styles.headerCount, { color: colors.gray['500'] }]}>
            {testsCount > 0
              ? `${testsCount} ${
                  testsCount === 1 ? 'результат' : 'результатов'
                }`
              : 'Нет результатов'}
          </Text>
        </View>
        <View
          style={[
            styles.caretChip,
            { backgroundColor: open ? colors.white : colors.gray['50'] },
            { transform: [{ rotate: open ? '180deg' : '0deg' }] },
          ]}
        >
          <SelectCaretIcon color={caretColor} />
        </View>
      </TouchableOpacity>
      {open && (
        <View style={styles.tests}>
          {medicalTests?.length ? (
            medicalTests?.map(test => (
              <HistoryCard
                key={`${test.biomaterialName}${test.registrationDate}`}
                color="orange"
                name={`${test.departmentName}`}
                subtitle={formatDate(test.registrationDate, 'DD MMMM YYYY')}
                onPress={() => onOpenTest(test as MISLaboratoryResult)}
              />
            ))
          ) : (
            <View
              style={[
                styles.card,
                { backgroundColor: colors.gray['200'], alignItems: 'center' },
              ]}
            >
              <Text style={[styles.cardTitle, { color: colors.gray['600'] }]}>
                Нет записей
              </Text>
            </View>
          )}
        </View>
      )}

      <BottomDrawer visible={!!selected} onClose={closeDrawer}>
        {selected && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            <Text style={[styles.drawerTitle, { color: colors.textMain }]}>
              {`${selected.biomaterialName} • ${selected.number}`}
            </Text>

            <View
              style={[styles.card, { backgroundColor: colors.gray['200'] }]}
            >
              <Text style={[styles.cardTitle, { color: colors.textMain }]}>
                Детали
              </Text>
              {!!selected.departmentName && (
                <Text style={{ color: colors.gray['700'], marginTop: 4 }}>
                  Отделение: {selected.departmentName}
                </Text>
              )}
              {!!selected.registrationDate && (
                <Text style={{ color: colors.gray['700'], marginTop: 4 }}>
                  Дата регистрации: {selected.registrationDate}
                </Text>
              )}
            </View>

            <View style={{ height: 12 }} />

            <TouchableOpacity
              onPress={() =>
                openPdf(
                  `medical_test_${selected.biomaterialName}_${selected.number}`,
                  selected.pdfBase64,
                )
              }
              activeOpacity={0.7}
              style={[styles.card, { backgroundColor: colors.gray['200'] }]}
              accessibilityRole="link"
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
              >
                <FileTextIcon color={colors.primary} />
                <Text
                  style={[styles.cardTitle, { color: colors.textMain }]}
                  numberOfLines={2}
                >
                  Результат анализа (PDF)
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </BottomDrawer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
  },
  headerBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTexts: {
    flex: 1,
    gap: 1,
  },
  headerEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  value: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },
  headerCount: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  caretChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tests: {
    marginTop: 8,
    gap: 7,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 12,
  },
  card: {
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
  },
});
