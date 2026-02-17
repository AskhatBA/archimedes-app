import { FC } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  Keyboard,
} from 'react-native';

import { WelcomeMessage, MessageInput, FeatureGrid } from '@/modules/medbot';

export const MedbotChatScreen: FC = () => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.internalContainer}>
              <WelcomeMessage />
              <FeatureGrid />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      <MessageInput />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  internalContainer: { marginTop: 18, paddingHorizontal: 32 },
});
