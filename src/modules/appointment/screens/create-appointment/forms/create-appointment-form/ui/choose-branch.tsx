import { FC, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { useBranches } from '@/modules/appointment/hooks/use-branches';
import { SelectField } from '@/shared/components/select-field/ui/select-field';
import { useTheme } from '@/shared/theme';

import { useCreateAppointment } from '../../../context/create-appointment-context';

import { createAppointmentFormStyles } from './styles';

const BRANCHES_TO_SHOW = ['ТОО "Archimedes Medical Group"'];

export const ChooseBranch: FC = () => {
  const { colors } = useTheme();
  const { branches, loadingBranches } = useBranches();
  const { changeFormValues, formValues } = useCreateAppointment();

  useEffect(() => {
    console.log('branches', branches);
  }, [branches]);

  const sectionsByCity = useMemo(() => {
    const filtered = (branches || []).filter(clinic =>
      BRANCHES_TO_SHOW.includes(clinic.name),
    );

    const getCity = (address?: string) => {
      if (!address) return 'Прочее';
      const firstPart = address.split(',')[0] || '';
      // remove common prefixes like 'г.' or 'г '
      return firstPart.replace(/^г\.?\s*/i, '').trim() || 'Прочее';
    };

    const map = new Map<
      string,
      { title: string; options: { label: string; value: string }[] }
    >();
    // eslint-disable-next-line no-restricted-syntax
    for (const clinic of filtered) {
      const city = getCity(clinic.address);
      if (!map.has(city)) {
        map.set(city, { title: city, options: [] });
      }
      map.get(city)!.options.push({
        label: clinic.address,
        value: String(clinic.id),
      });
    }
    return Array.from(map.values());
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
