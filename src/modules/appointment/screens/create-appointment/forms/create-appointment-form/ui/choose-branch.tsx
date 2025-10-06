import { FC } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { useBranches } from '@/modules/appointment/hooks/use-branches';
import { useTheme } from '@/shared/theme';

import {
  CardRadioGroup,
  RadioCard,
} from '../../../components/card-radio-group';
import { useCreateAppointment } from '../../../context/create-appointment-context';

import { createAppointmentFormStyles } from './styles';

export const ChooseBranch: FC = () => {
  const { colors } = useTheme();
  const { branches, loadingBranches } = useBranches();
  const { branch, setBranch } = useCreateAppointment();

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
      <CardRadioGroup value={branch} onChange={setBranch}>
        {branches?.map(clinic => (
          <RadioCard
            key={clinic.id}
            value={clinic.id}
            label={`${clinic.name} (${clinic.address})`}
          />
        ))}
      </CardRadioGroup>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 22,
  },
});
