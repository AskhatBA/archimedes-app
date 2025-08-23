import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToLocalStorage = async (key: string, value: unknown) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = async (
  key: string,
  options?: { convertToJSON: boolean },
) => {
  const value = await AsyncStorage.getItem(key);
  if (!value) return '';
  if (options?.convertToJSON) return JSON.parse(value);
  return value;
};

export const removeFromLocalStorage = async (key: string) => {
  await AsyncStorage.removeItem(key);
};
