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

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const document = useAppSelector(selectDocumentById(id as string));
  const [isFitMode, setIsFitMode] = useState(true);

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
  const photoUri = document.documemtImages?.[0]?.uri;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="h-2/5 bg-card">
        <View className="absolute top-2 right-2 z-10">
          <TouchableOpacity
            onPress={() => setIsFitMode(!isFitMode)}
            className="bg-card/80 rounded-full p-2"
          >
            <MaterialIcon
              name={isFitMode ? "fit-screen" : "fullscreen"}
              size={24}
              className="text-foreground"
            />
          </TouchableOpacity>
        </View>

        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            className="w-full h-full"
            resizeMode={isFitMode ? "contain" : "cover"}
          />
        ) : (
          <View className="w-full h-full justify-center items-center bg-muted/10">
            <Text className="text-muted-foreground">Kein Bild verfügbar</Text>
          </View>
        )}
      </View>

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
              <Text className="text-foreground">Datum: {summary.datum}</Text>
              <Text className="text-foreground">
                Beschreibung: {summary.beschreibung}
              </Text>
              <Text className="text-foreground">
                Betrag: {summary.betrag.toFixed(2)} CHF
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
