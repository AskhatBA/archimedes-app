import { FC, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { useBranches } from '@/modules/appointment/hooks/use-branches';
import { SelectField } from '@/shared/components/select-field/ui/select-field';
import { useTheme } from '@/shared/theme';

import { useCreateAppointment } from '../../../context/create-appointment-context';

import { createAppointmentFormStyles } from './styles';

const BRANCHES_TO_SHOW = [
  'ТОО "Archimedes Medical Group"',
  'ТОО "Archimedes Medical Group" педиатрия',
];

export const ChooseBranch: FC = () => {
  const { colors } = useTheme();
  const { branches, loadingBranches } = useBranches();
  const { changeFormValues, formValues } = useCreateAppointment();

  const sectionsByCity = useMemo(() => {
    const filtered = (branches || []).filter(clinic =>
      BRANCHES_TO_SHOW.includes(clinic.name),
    );

    const getCity = (address?: string) => {
      if (!address) return 'Прочее';
      const firstPart = address.split(',')[0] || '';
      return firstPart.replace(/^г\.?\s*/i, '').trim() || 'Прочее';
    };

    const citiesMap = new Map<
      string,
      { title: string; options: { label: string; value: string }[] }
    >();
    // eslint-disable-next-line no-restricted-syntax
    for (const clinic of filtered) {
      const city = getCity(clinic.address);
      if (!citiesMap.has(city)) {
        citiesMap.set(city, { title: city, options: [] });
      }
      const afterCity = clinic.address?.split(',').slice(1).join(',').trim();
      citiesMap.get(city)!.options.push({
        label: afterCity || clinic.address || '',
        value: String(clinic.id),
      });
    }
    return Array.from(citiesMap.values());
  }, [branches]);

  if (loadingBranches) return null;

  return (
    <View style={styles.container}>
      <Text
        style={[
          createAppointmentFormStyles.title,
          { color: colors.gray['500'] },
        ]}
      >
        Выберите филиал
      </Text>
      <SelectField
        sections={sectionsByCity}
        value={formValues.branchId ? String(formValues.branchId) : ''}
        placeholder="Филиал"
        onChange={value => {
          changeFormValues('branchId', value as never);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
});
