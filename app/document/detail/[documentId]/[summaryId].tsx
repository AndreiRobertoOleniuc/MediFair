// filepath: /Users/andreioleniuc/Documents/Code/Projects/tarmed-validator/tarmed-frontend/app/document/detail/[documentId]/[summaryId].tsx
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
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <Text className="text-foreground">Document not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { scanResponse } = document;
  if (!scanResponse) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <Text className="text-foreground">No scan data available</Text>
        </View>
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
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <Text className="text-foreground">Summary not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Pull out the relevant originals via summary.relevant_ids
  const relevantOriginals = summary.relevant_ids.map(
    (origIndex: number) => original[origIndex]
  );

  return (
    <SafeAreaView>
      <View className="px-6 py-4">
        <View className="flex-col w-full">
          <View className="flex-row justify-between mb-4">
            <Text className="text-foreground text-xl font-bold">
              {summary.emoji} {summary.titel}
            </Text>
            <Text className="text-foreground text-muted-foreground">
              {summary.datum}
            </Text>
          </View>
          <Text>{summary.beschreibung}</Text>
        </View>

        <ScrollView className="mt-4 h-3/5">
          {relevantOriginals.map((original, index) => (
            <View
              className="bg-card rounded-sm mb-4 shadow-xsm p-3"
              key={index}
            >
              <View className="flex-row justify-end mb-4">
                <Text className="text-foreground text-muted-foreground">
                  CHF {original.betrag.toFixed(2)}
                </Text>
              </View>
              <Text className="text-foreground mb-4">
                {original.beschreibung}
              </Text>
              <Text className="text-foreground text-muted-foreground">
                {original.tarifziffer}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View className="flex-row justify-between mt-4 self-end">
          <Text className="text-foreground text-xl font-bold">
            Total: CHF {summary.betrag.toFixed(2)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
