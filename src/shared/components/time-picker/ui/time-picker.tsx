import RNDateTimePicker, {
  IOSNativeProps,
  AndroidNativeProps,
  WindowsNativeProps,
} from '@react-native-community/datetimepicker';
import { FC, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { BottomDrawer } from '@/shared/components/bottom-drawer';
import { Button } from '@/shared/components/button';
import { formatDate } from '@/shared/lib/date';
import { useTheme } from '@/shared/theme';

type DateTimePickerProps = (
  | IOSNativeProps
  | AndroidNativeProps
  | WindowsNativeProps
) & { placeholder?: string; onChange?: (timestamp: number) => void };

export const TimePicker: FC<DateTimePickerProps> = ({
  value,
  placeholder,
  onChange,
  ...props
}) => {
  const [iosPickerOpened, setIosPickerOpened] = useState(false);
  const [timestamp, setTimestamp] = useState<number>();
  const { colors } = useTheme();

  const openTimepicker = () => {
    if (Platform.OS === 'android') {
      return;
    }
    if (Platform.OS === 'ios') {
      setIosPickerOpened(true);
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.trigger, { backgroundColor: colors.gray['200'] }]}
        onPress={openTimepicker}
      >
        <Text style={[styles.value, { color: colors.gray['500'] }]}>
          {value ? formatDate(value, 'HH:mm') : placeholder}
        </Text>
      </TouchableOpacity>
      <BottomDrawer
        visible={iosPickerOpened}
        onClose={() => setIosPickerOpened(false)}
      >
        <View style={styles.pickerContainer}>
          <RNDateTimePicker
            value={value}
            display="spinner"
            onChange={event => {
              if (event.nativeEvent.timestamp)
                setTimestamp(event.nativeEvent.timestamp);
            }}
            {...props}
            mode="time"
          />
          <Button
            style={styles.submitButton}
            onPress={() => {
              if (onChange) onChange(timestamp);
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
  },
  submitButton: {
    width: '100%',
    marginTop: 8,
  },
});
