import RNDateTimePicker from '@react-native-community/datetimepicker';
import { FC, useState } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';

import { formatDate, formatToDateObject } from '@/shared/adapters/date';
import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { Button } from '@/shared/components/button';
import { useTheme } from '@/shared/theme';

import { FieldTrigger } from './field-trigger';

type DateTimePickerProps = {
  placeholder?: string;
  onChange?: (date: string) => void;
  label?: string;
  value?: string;
  error?: string;
};

export const Datepicker: FC<DateTimePickerProps> = ({
  value,
  placeholder,
  onChange,
  label,
  error,
}) => {
  const [iosPickerOpened, setIosPickerOpened] = useState(false);
  const [timestamp, setTimestamp] = useState<number>();
  const { colors } = useTheme();

  const openPicker = () => {
    if (Platform.OS === 'android') {
      return;
    }
    if (Platform.OS === 'ios') {
      setIosPickerOpened(true);
    }
  };

  return (
    <View>
      {label && (
        <Text style={[styles.label, { color: colors.blue['370'] }]}>
          {label}
        </Text>
      )}
      <FieldTrigger
        error={error}
        value={value ? formatDate(value, 'DD.MM.YYYY') : placeholder}
        onOpen={openPicker}
      />
      <BottomDrawer
        visible={iosPickerOpened}
        onClose={() => setIosPickerOpened(false)}
      >
        <View style={styles.pickerContainer}>
          <RNDateTimePicker
            value={timestamp ? formatToDateObject(timestamp) : new Date()}
            display="spinner"
            onChange={event => {
              if (event.nativeEvent.timestamp)
                setTimestamp(event.nativeEvent.timestamp);
            }}
            themeVariant="light"
            mode="date"
          />
          <Button
            style={styles.submitButton}
            onPress={() => {
              if (onChange) onChange(formatDate(timestamp));
              setIosPickerOpened(false);
            }}
          >
            Ок
          </Button>
        </View>
      </BottomDrawer>
    </View>
  );
};

const styles = StyleSheet.create({
  trigger: {
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
  pickerContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  submitButton: {
    width: '100%',
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 600,
    marginBottom: 9,
  },
});
