import React from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAppSelector } from "~/store/hooks";
import { selectDocumentById } from "~/store/selectors/documentSelectors";
import { Text } from "@/components/nativewindui/Text";

export default function DocumentDetail() {
  const { documentId, summaryId } = useLocalSearchParams();
  const document = useAppSelector(selectDocumentById(documentId as string));

  if (!document) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Text className="text-foreground">Document not found</Text>
      </SafeAreaView>
    );
  }

  const { scanResponse } = document;
  if (!scanResponse) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Text className="text-foreground">No scan data available</Text>
      </SafeAreaView>
    );
  }

  // Retrieve original items and all summaries
  const { original, summaries } = scanResponse;

  // Convert summaryId to an index, fallback if needed
  const summaryIndex = parseInt(summaryId as string, 10);
  const summary = summaries?.[summaryIndex];

  // Summary not found fallback
  if (!summary) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Text className="text-foreground">Summary not found</Text>
      </SafeAreaView>
    );
  }

  // Pull out the relevant originals via summary.relevant_ids
  const relevantOriginals = summary.relevant_ids.map(
    (origIndex: number) => original[origIndex]
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Summary Info */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-xl font-bold text-foreground">
              {summary.emoji} {summary.titel}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {summary.datum}
            </Text>
          </View>
          <Text className="mt-2 text-foreground">{summary.beschreibung}</Text>
        </View>

        {relevantOriginals.map((item, index) => (
          <View
            key={index}
            className="bg-card w-full rounded-md shadow px-4 py-3 mb-4"
          >
            {/* Row with description and amount side by side */}
            <View className="flex-row items-center justify-between mb-1">
              <Text
                className="flex-1 text-base font-semibold text-foreground mr-2"
                numberOfLines={2} // optional if you want to truncate
              >
                {item.beschreibung}
              </Text>
              <Text className="text-base text-muted-foreground">
                CHF {item.betrag.toFixed(2)}
              </Text>
            </View>
            {/* Tarifziffer or other metadata below */}
            <Text className="text-sm text-muted-foreground">
              {item.tarifziffer}
            </Text>
          </View>
        ))}

        {/* Total */}
        <View className="mt-4 border-t border-divider pt-4 flex-row justify-end">
          <Text className="text-xl font-bold text-foreground">
            Total: CHF {summary.betrag.toFixed(2)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
