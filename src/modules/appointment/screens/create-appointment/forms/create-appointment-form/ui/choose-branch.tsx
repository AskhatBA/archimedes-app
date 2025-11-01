import { FC, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { useBranches } from '@/modules/appointment/hooks/use-branches';
import { SelectField } from '@/shared/components/select-field/ui/select-field';
import { useTheme } from '@/shared/theme';

import { useCreateAppointment } from '../../../context/create-appointment-context';

import { createAppointmentFormStyles } from './styles';

export const ChooseBranch: FC = () => {
  const { colors } = useTheme();
  const { branches, loadingBranches } = useBranches();
  const { changeFormValues, formValues } = useCreateAppointment();

  const branchOptions = useMemo(
    () =>
      (branches || []).map(clinic => ({
        label: `${clinic.name} (${clinic.address})`,
        value: String(clinic.id),
      })),
    [branches],
  );

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
        options={branchOptions}
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
