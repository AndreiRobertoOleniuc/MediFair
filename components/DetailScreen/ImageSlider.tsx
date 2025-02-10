import { View, Image, TouchableOpacity } from "react-native";
import { Text } from "@/components/nativewindui/Text";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "../../lib/useColorScheme";

export default function ImageSlider({
  images,
  currentIndex,
  onPrev,
  onNext,
  isFitMode,
  toggleFitMode,
}: {
  images: string[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  isFitMode: boolean;
  toggleFitMode: () => void;
}) {
  const { colors } = useColorScheme();

  return (
    <View className={`relative bg-card ${isFitMode ? "h-2/5" : "flex-1 px-4"}`}>
      <View className="absolute top-2 right-2 z-10">
        <TouchableOpacity
          onPress={toggleFitMode}
          className="bg-card/80 rounded-full p-2"
        >
          <MaterialIcon
            name={isFitMode ? "fit-screen" : "fullscreen"}
            size={24}
            color={colors.foreground}
          />
        </TouchableOpacity>
      </View>

      <View className="w-full h-full relative">
        <Image
          source={{ uri: images[currentIndex] }}
          className="w-full h-full"
          resizeMode="contain"
        />

        <TouchableOpacity
          className={`absolute ${isFitMode ? "left-2 top-1/2 -translate-y-1/2" : "left-2 bottom-2"}`}
          onPress={onPrev}
          disabled={currentIndex === 0}
        >
          <MaterialIcon name="chevron-left" size={30} color={colors.grey} />
        </TouchableOpacity>

        <TouchableOpacity
          className={`absolute ${isFitMode ? "right-2 top-1/2 -translate-y-1/2" : "right-2 bottom-2"}`}
          onPress={onNext}
          disabled={currentIndex === images.length - 1}
        >
          <MaterialIcon name="chevron-right" size={30} color={colors.grey} />
        </TouchableOpacity>

        {/* Pagination Indicator */}
        <View className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-card/80 rounded-full px-3 py-1">
          <Text className="text-foreground text-sm">
            {currentIndex + 1} von {images.length}
          </Text>
        </View>
      </View>
    </View>
  );
}
