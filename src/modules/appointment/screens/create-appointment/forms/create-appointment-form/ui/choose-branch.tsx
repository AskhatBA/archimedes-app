import { FC, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { useTheme } from '@/shared/theme';

import {
  CardRadioGroup,
  RadioCard,
} from '../../../components/card-radio-group';
import { clinicBranches } from '../../../data';

import { createAppointmentFormStyles } from './styles';

export const ChooseBranch: FC = () => {
  const { colors } = useTheme();
  const [branch, setBranch] = useState('');

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
        {clinicBranches.map(clinic => (
          <RadioCard
            key={clinic.value}
            value={clinic.value}
            label={clinic.label}
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
