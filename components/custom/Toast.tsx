import * as React from "react";
import { Animated, ViewStyle, TouchableOpacity, View } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { cn } from "../../lib/cn";
import { Text } from "../nativewindui/Text";
import { useColorScheme } from "../../hooks/useColorScheme";

const toastVariants = cva(
  "px-4 py-3 rounded-lg shadow-xl flex-row items-center justify-between",
  {
    variants: {
      variant: {
        default: "bg-card border-2 border-border",
        success: "bg-primary border-2 border-primary/50",
        error: "bg-destructive border-2 border-destructive/50",
        warning: "bg-orange-500 border-2 border-orange-500/50",
        info: "bg-blue-500 border-2 border-blue-500/50",
      },
      position: {
        top: "absolute top-10 left-4 right-4",
        bottom: "absolute bottom-10 left-4 right-4",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "top",
    },
  }
);

const iconVariants = {
  default: "info-outline",
  success: "check-circle-outline",
  error: "error",
  warning: "warning-amber",
  info: "info-outline",
};

type ToastVariantProps = VariantProps<typeof toastVariants>;

export interface ToastProps extends ToastVariantProps {
  /** The message to display in the toast */
  message: string;
  /** Whether the toast is visible */
  visible: boolean;
  /** Function to call when the toast should be dismissed */
  onDismiss: () => void;
  /** Optional duration in ms before the toast auto-dismisses (default: 3000) */
  duration?: number;
  /** Optional action button text */
  actionLabel?: string;
  /** Function to call when action button is pressed */
  onAction?: () => void;
}

/**
 * A reusable Toast component using NativeWind for React Native.
 * Automatically animates in and out and supports different variants.
 */
export const Toast = React.forwardRef<
  React.ElementRef<typeof Animated.View>,
  ToastProps
>(
  (
    {
      message,
      visible,
      onDismiss,
      variant = "default",
      position = "bottom",
      duration = 3000,
      actionLabel,
      onAction,
    },
    ref
  ) => {
    const { colors } = useColorScheme();
    const opacity = React.useRef(new Animated.Value(0)).current;
    const translateY = React.useRef(
      new Animated.Value(position === "top" ? -20 : 20)
    ).current;

    // Animation functions
    const fadeIn = React.useCallback(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, [opacity, translateY]);

    const fadeOut = React.useCallback(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: position === "top" ? -20 : 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => onDismiss());
    }, [opacity, translateY, onDismiss, position]);

    // Handle visibility changes
    React.useEffect(() => {
      let timeoutId: NodeJS.Timeout;

      if (visible) {
        fadeIn();
        if (duration) {
          timeoutId = setTimeout(() => {
            fadeOut();
          }, duration);
        }
      } else {
        fadeOut();
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }, [visible, fadeIn, fadeOut, duration]);

    // Early return if not visible
    if (!visible) return null;

    // Get the appropriate icon
    const iconName = iconVariants[variant || "default"];

    // Get the icon color based on variant
    const getIconColor = () => {
      switch (variant) {
        case "success":
          return "#ffffff";
        case "error":
          return "#ffffff";
        case "warning":
          return "#ffffff";
        case "info":
          return "#ffffff";
        default:
          return colors.grey;
      }
    };

    const getTextColor = () => {
      switch (variant) {
        case "error":
          return "text-white";
        case "warning":
          return "text-white";
        case "info":
          return "text-white";
        default:
          return "text-foreground";
      }
    };

    // Use a shadow style to make the toast stand out more
    const shadowStyle = {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.27,
      shadowRadius: 4.65,
      elevation: 6,
    };

    return (
      <Animated.View
        ref={ref}
        style={
          {
            opacity,
            transform: [{ translateY }],
            ...shadowStyle,
          } as ViewStyle
        }
        className={cn(toastVariants({ variant, position }))}
      >
        <View className="flex-row items-center flex-1">
          <MaterialIcon
            name={iconName as any} /* Instead of "error" */
            size={24}
            color={getIconColor()}
            className="mr-3"
          />
          <Text className={`flex-1 font-normal mr-3 ${getTextColor()}`}>
            {message}
          </Text>
        </View>

        {actionLabel && onAction ? (
          <TouchableOpacity onPress={onAction} className="ml-3">
            <Text className="font-bold text-primary">{actionLabel}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={fadeOut}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <MaterialIcon name="close" size={20} color={"#ffffff"} />
          </TouchableOpacity>
        )}
      </Animated.View>
    );
  }
);

Toast.displayName = "Toast";
