import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "@/components/nativewindui/Text";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useColorScheme } from "../../hooks/useColorScheme";

export default function SummaryList({
  summaries,
}: {
  summaries: Array<{
    datum: string;
    titel: string;
    emoji: string | null;
    betrag: number;
    id: string; // And a summary id
  }>;
}) {
  const { colors } = useColorScheme();

  return (
    <View className="p-4">
      <Text variant="title3" className="mb-4 text-foreground font-semibold">
        Zusammenfassung
      </Text>
      <ScrollView
        className="h-[80%]"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {summaries.map((summary, index) => (
          <TouchableOpacity
            className="bg-card rounded-sm mb-4 shadow-xsm p-3"
            key={index}
            onPress={() => {
              router.push({
                pathname: "/document/detail/[summaryId]",
                params: {
                  summaryId: summary.id, // pass the summary's id
                },
              });
            }}
          >
            <View className="flex-row justify-between">
              <Text className="text-foreground"></Text>
              <Text className="text-muted-foreground">{summary.datum}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-foreground text-xl font-bold my-3 w-4/5">
                {summary.emoji} {summary.titel}
              </Text>
              <MaterialIcon
                name="arrow-forward-ios"
                size={13}
                color={colors.primary}
              />
            </View>
            <Text className="text-foreground">
              CHF {summary.betrag.toFixed(2)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
