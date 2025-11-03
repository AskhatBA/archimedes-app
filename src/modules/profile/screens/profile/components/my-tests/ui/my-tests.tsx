import { FC, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';

import { useMedicalTests } from '@/modules/profile/hooks/use-medical-tests';
import { BottomDrawer } from '@/shared/components/bottom-drawer';
import {
  SelectCaretIcon,
  ClipboardListIcon,
  FileTextIcon,
} from '@/shared/icons';
import { useTheme } from '@/shared/theme';

import { HistoryCard } from '../../history-card';

import type { MISLaboratoryResult } from '@/api/generated/data-contracts';

export const MyTests: FC = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<MISLaboratoryResult | null>(null);
  const { colors } = useTheme();
  const { medicalTests } = useMedicalTests();

  const headerBg = open ? colors.blue['100'] : colors.gray['200'];
  const headerText = open ? colors.blue['400'] : colors.gray['700'];
  const caretColor = open ? colors.blue['400'] : colors.gray['700'];

  const onOpenTest = (test: MISLaboratoryResult) => setSelected(test);
  const closeDrawer = () => setSelected(null);

  const openPdf = async (fileName: string, base64?: string) => {
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}.pdf`;
    await RNFS.writeFile(path, base64, 'base64');
    await FileViewer.open(path);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setOpen(prev => !prev)}
        style={[styles.fieldContainer, { backgroundColor: headerBg }]}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <ClipboardListIcon color={headerText} />
          <Text numberOfLines={1} style={[styles.value, { color: headerText }]}>
            Мои анализы
          </Text>
        </View>
        <SelectCaretIcon color={caretColor} />
      </TouchableOpacity>
      {open && (
        <View style={styles.tests}>
          {medicalTests?.map(test => (
            <HistoryCard
              key={`${test.biomaterialName}${test.registrationDate}`}
              color="orange"
              name={`${test.biomaterialName} - ${test.number}`}
              subtitle={test.departmentName}
              onPress={() => onOpenTest(test as MISLaboratoryResult)}
            />
          ))}
        </View>
      )}

      <BottomDrawer visible={!!selected} onClose={closeDrawer}>
        {selected && (
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          >
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
          </ScrollView>
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
    justifyContent: 'space-between',
    borderRadius: 15,
    padding: 18,
  },
  value: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 600,
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
