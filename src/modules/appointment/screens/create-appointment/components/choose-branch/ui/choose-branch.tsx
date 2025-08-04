import { FC, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { useTheme } from '@/shared/theme';

import { clinicBranches } from '../../../data';
import { CardRadioGroup, RadioCard } from '../../card-radio-group';

export const ChooseBranch: FC = () => {
  const { colors } = useTheme();
  const [branch, setBranch] = useState('');

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.gray['500'] }]}>
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
  title: {
    fontWeight: 600,
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: 0,
    marginBottom: 11,
  },
});
