import { View, ScrollView } from "react-native";
import { Text } from "@/components/nativewindui/Text";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

export default function SummaryList({
  summaries,
  colors,
}: {
  summaries: Array<{
    datum: string;
    titel: string;
    emoji: string;
    betrag: number;
  }>;
  colors: { foreground: string; grey: string };
}) {
  return (
    <View className="p-4">
      <Text variant="title3" className="mb-4 text-foreground font-semibold">
        Zusammenfassung / Erklärung
      </Text>
      <ScrollView
        className="h-96"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {summaries.map((summary, index) => (
          <View key={index} className="bg-card rounded-sm mb-4 shadow-xsm p-3">
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
  );
}
