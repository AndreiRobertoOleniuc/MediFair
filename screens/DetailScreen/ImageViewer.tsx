import { View, Image, TouchableOpacity } from "react-native";
import { Text } from "@/components/nativewindui/Text";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "~/hooks/useColorScheme";

export default function ImageViewer({
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
    <View
      className={`relative bg-card mx-4 rounded-sm ${isFitMode ? "" : "flex-1 px-4 mb-8"}`}
    >
      {isFitMode ? (
        <View className="p-4 w-full flex flex-row justify-between">
          <TouchableOpacity onPress={toggleFitMode}>
            <View className="flex flex-row items-center">
              <Text className="font-semibold mr-2">View Image</Text>
              <MaterialIcon
                name="zoom-in"
                size={24}
                color={colors.foreground}
              />
            </View>
          </TouchableOpacity>
          <View className="flex flex-row justify-end items-start">
            {images.slice(0, 3).map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                className="h-14 w-14 ml-2"
                resizeMode="cover"
              />
            ))}
          </View>
        </View>
      ) : (
        <View className="rounded-sm">
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
              className={`absolute ${isFitMode ? "left-2 top-1/2 -translate-y-1/2" : "left-2 bottom-2"}  ${images.length === 1 ? "hidden" : ""}`}
              onPress={onPrev}
              disabled={currentIndex === 0}
            >
              <MaterialIcon name="chevron-left" size={30} color={colors.grey} />
            </TouchableOpacity>

            <TouchableOpacity
              className={`absolute ${isFitMode ? "right-2 top-1/2 -translate-y-1/2" : "right-2 bottom-2"} ${images.length === 1 ? "hidden" : ""}`}
              onPress={onNext}
              disabled={currentIndex === images.length - 1}
            >
              <MaterialIcon
                name="chevron-right"
                size={30}
                color={colors.grey}
              />
            </TouchableOpacity>

            <View
              className={`absolute bottom-2 left-1/2 -translate-x-1/2 bg-card/80 rounded-full px-3 py-1  ${images.length === 1 ? "hidden" : ""}`}
            >
              <Text className="text-foreground text-sm">
                {currentIndex + 1} von {images.length}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
