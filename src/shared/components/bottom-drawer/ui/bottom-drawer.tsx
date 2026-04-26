import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { FC, ReactNode, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CloseIcon } from '@/shared/icons';
import { useTheme } from '@/shared/theme';

interface BottomDrawerProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  scrollable?: boolean;
}

export const BottomDrawer: FC<BottomDrawerProps> = ({
  visible,
  onClose,
  children,
  scrollable = false,
}) => {
  const Container = scrollable ? BottomSheetScrollView : BottomSheetView;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (visible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [visible]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        opacity={0.4}
      />
    ),
    [],
  );

  const renderHeader = () => (
    <TouchableOpacity
      onPress={() => {
        sheetRef.current?.dismiss();
      }}
      style={[styles.handle, { backgroundColor: colors.gray['200'] }]}
    >
      <CloseIcon width={22} height={22} color={colors.gray['600']} />
    </TouchableOpacity>
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      enableDynamicSizing
      enablePanDownToClose
      onDismiss={onClose}
      backdropComponent={renderBackdrop}
      handleComponent={null}
      backgroundStyle={styles.background}
      enableContentPanningGesture={false}
      topInset={100}
    >
      {scrollable && renderHeader()}
      <Container
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 16 },
        ]}
        style={[styles.content, { paddingBottom: insets.bottom + 16 }]}
      >
        {!scrollable && renderHeader()}
        {children}
      </Container>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  background: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  content: {},
  handle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginTop: 10,
    marginRight: 8,
  },
});
