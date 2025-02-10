import { useAppSelector } from "@/store/hooks";
import { selectDocumentById } from "@/store/selectors/documentSelectors";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Text } from "@/components/nativewindui/Text";
import { useState } from "react";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { Secrets } from "~/Secrets";
import { useColorScheme } from "../../lib/useColorScheme";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const document = useAppSelector(selectDocumentById(id as string));
  const [isFitMode, setIsFitMode] = useState(true);
  const { colors } = useColorScheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!document || !document.scanResponse) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <Text className="text-foreground">Document not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { summaries } = document.scanResponse;
  let photoUri: string[] = document.documemtImages.map((img) => img.uri);
  if (Secrets.imageSimulatorMode) {
    photoUri = [
      "https://storage.googleapis.com/exercise-app-assets/imageV2.2.jpg",
      "https://storage.googleapis.com/exercise-app-assets/imageV2.1.jpg",
    ];
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Use full screen for image if zoomed */}
      <View
        className={`relative bg-card ${isFitMode ? "h-2/5" : "flex-1 px-4"}`}
      >
        <View className="absolute top-2 right-2 z-10">
          <TouchableOpacity
            onPress={() => setIsFitMode(!isFitMode)}
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
            source={{ uri: photoUri[currentImageIndex] }}
            className="w-full h-full"
            // Use contain regardless so that the entire image fits
            resizeMode="contain"
          />

          <TouchableOpacity
            className={`absolute ${isFitMode ? "left-2 top-1/2 -translate-y-1/2" : "left-2 bottom-2"}`}
            onPress={() =>
              currentImageIndex > 0 &&
              setCurrentImageIndex(currentImageIndex - 1)
            }
            disabled={currentImageIndex === 0}
          >
            <MaterialIcon name="chevron-left" size={30} color={colors.grey} />
          </TouchableOpacity>

          <TouchableOpacity
            className={`absolute ${isFitMode ? "right-2 top-1/2 -translate-y-1/2" : "right-2 bottom-2"}`}
            onPress={() =>
              currentImageIndex < photoUri.length - 1 &&
              setCurrentImageIndex(currentImageIndex + 1)
            }
            disabled={currentImageIndex === photoUri.length - 1}
          >
            <MaterialIcon name="chevron-right" size={30} color={colors.grey} />
          </TouchableOpacity>

          {/* Pagination Indicator */}
          <View className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-card/80 rounded-full px-3 py-1">
            <Text className="text-foreground text-sm">
              {currentImageIndex + 1} von {photoUri.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Only show summaries when in fit mode */}
      {isFitMode && (
        <View className="p-4">
          <Text variant="title3" className="mb-4 text-foreground">
            Zusammenfassung / Erklärung
          </Text>
          <ScrollView
            className="h-96"
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {summaries.map((summary, index) => (
              <View
                key={index}
                className="bg-card rounded-sm mb-4 shadow-xsm p-3"
              >
                <View className="flex-row justify-between">
                  <Text className="text-foreground"></Text>
                  <Text className="text-foreground text-muted-foreground">
                    {summary.datum}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-foreground text-xl font-bold my-3 w-4/5">
                    {summary.emoji} {summary.titel}
                  </Text>
                  <MaterialIcon
                    name="arrow-forward-ios"
                    size={13}
                    color={colors.grey}
                  />
                </View>
                <Text className="text-foreground">
                  CHF {summary.betrag.toFixed(2)}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}
