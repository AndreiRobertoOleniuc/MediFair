import * as React from "react";
import { Modal, TouchableOpacity, View, ModalProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { cn } from "../../lib/cn";
import { Text } from "../nativewindui/Text";
import { useColorScheme } from "../../lib/useColorScheme";

const dialogVariants = cva("p-6 rounded-lg shadow-lg", {
  variants: {
    size: {
      sm: "w-80",
      md: "w-96",
      lg: "w-[28rem]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type DialogVariantProps = VariantProps<typeof dialogVariants>;

export interface DialogProps extends ModalProps, DialogVariantProps {
  /** Controls the visibility of the dialog */
  visible: boolean;
  /** Optional title text for the dialog */
  title?: string;
  /** Content to be rendered inside the dialog */
  children?: React.ReactNode;
  /** Callback when the dialog should close */
  onClose: () => void;
}

/**
 * A reusable Dialog component using NativeWind and React Native Modal.
 */
const Dialog = React.forwardRef<View, DialogProps>(
  ({ visible, title, children, size, onClose, ...props }, ref) => {
    const { colors } = useColorScheme();

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
        {...props}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View ref={ref} className={cn(dialogVariants({ size }), "bg-card")}>
            {/* Header with title and close icon */}
            <View className="flex-row justify-between mb-4">
              {title && (
                <Text variant="heading" className="flex-1">
                  {title}
                </Text>
              )}
              <TouchableOpacity
                onPress={onClose}
                className="p-1"
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <MaterialIcon name="close" size={24} color={colors.grey} />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View className="mb-4">{children}</View>
          </View>
        </View>
      </Modal>
    );
  }
);

Dialog.displayName = "Dialog";

export { Dialog };
