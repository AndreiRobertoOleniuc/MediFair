import * as React from "react";
import { Animated, Easing, ViewProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

/**
 * Define skeleton styling variants using NativeWind classes.
 * Variants include:
 * - variant: to choose between rectangular, circular, or text styles.
 * - size: to control the default dimensions.
 *
 * Example usage:
 * ```tsx
 *  <View className="p-4">
 *     <Skeleton isLoading>
 *         <View className="bg-gray-200 dark:bg-gray-700 rounded-full h-16 w-16" />
 *     </Skeleton>
 *  </View>
 */
const skeletonVariants = cva("bg-gray-200 dark:bg-gray-700", {
  variants: {
    variant: {
      rectangular: "rounded-lg",
      circular: "rounded-full",
      text: "rounded",
    },
    size: {
      sm: "h-4 w-20",
      md: "h-6 w-32",
      lg: "h-8 w-40",
    },
  },
  defaultVariants: {
    variant: "rectangular",
    size: "md",
  },
});

export type SkeletonProps = ViewProps &
  VariantProps<typeof skeletonVariants> & {
    /**
     * When true, the skeleton shows a pulsating animation.
     */
    isLoading?: boolean;
    /**
     * Duration for the opacity animation (in milliseconds).
     */
    animationDuration?: number;
    /**
     * Optional custom shape provided by the consumer.
     * If provided, the children will be wrapped in the pulsating Animated.View.
     */
    children?: React.ReactNode;
  };

/**
 * Skeleton component implemented as an Animated.View.
 * It pulsates between two opacity values when loading.
 * If a custom shape is provided via children, it will render that shape;
 * otherwise, it falls back to using the default variant styles.
 */
const Skeleton = React.forwardRef<
  React.ElementRef<typeof Animated.View>,
  SkeletonProps
>(
  (
    {
      variant,
      size,
      className,
      isLoading = true,
      animationDuration = 800,
      style,
      children,
      ...props
    },
    ref
  ) => {
    // Animated value for opacity used to create a pulsating effect.
    const opacity = React.useRef(new Animated.Value(0.5)).current;

    React.useEffect(() => {
      if (isLoading) {
        // Create an infinite loop animation that transitions the opacity.
        Animated.loop(
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: animationDuration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
            Animated.timing(opacity, {
              toValue: 0.5,
              duration: animationDuration,
              useNativeDriver: true,
              easing: Easing.inOut(Easing.ease),
            }),
          ])
        ).start();
      } else {
        // If not loading, show the component fully visible.
        opacity.setValue(1);
      }
    }, [isLoading, opacity, animationDuration]);

    // If a custom shape is provided, wrap it with the animated container.
    if (children) {
      return (
        <Animated.View ref={ref} style={[{ opacity }, style]} {...props}>
          {children}
        </Animated.View>
      );
    }

    // Otherwise, render the default shape with variant styling.
    return (
      <Animated.View
        ref={ref}
        style={[{ opacity }, style]}
        className={cn(skeletonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };
