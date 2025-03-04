import React from "react";
import { View, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  selectDocumentById,
  selectDocumentStatus,
  selectTarmedPositionExplanation,
} from "~/store/selectors/documentSelectors";
import { Text } from "@/components/nativewindui/Text";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "~/lib/useColorScheme";
import { TarmedPosition } from "~/models/Document";
import { explainPosition } from "~/store/asyncThunks/documentThunks";

export default function DocumentDetail() {
  const { documentId, summaryId } = useLocalSearchParams();
  const document = useAppSelector(selectDocumentById(Number(documentId)));
  const explanation = useAppSelector(selectTarmedPositionExplanation);
  const status = useAppSelector(selectDocumentStatus);

  const { colors } = useColorScheme();
  //TODO: Use the Explanation Endpoint to fetch the explanation for the TarmedPosition
  // While fetching open a dialog with skeleton loader -> check the status from documentReducer to determine if loading or not
  const dispatch = useAppDispatch();

  const fetchExplanation = async (tarmedPosition: TarmedPosition) => {
    await dispatch(explainPosition(tarmedPosition));
  };

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
          <View className="flex-row justify-between items-start">
            <Text className="text-xl font-bold text-foreground w-3/4">
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
            <View className="flex-row">
              <Text className="text-xl  font-semibold text-foreground flex-1 mr-2">
                {item.titel}
              </Text>
              <Text className="text-base text-muted-foreground justify-start">
                CHF {item.betrag.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-foreground mt-1 w-3/4 ">
                {item.beschreibung}
              </Text>
              <TouchableOpacity onPress={() => fetchExplanation(item)}>
                <MaterialIcon
                  name="help-outline"
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            <Text className="text-sm text-muted-foreground mt-1">
              {item.tarifziffer}
            </Text>
          </View>
        ))}

        <View className="mt-4 border-t border-divider pt-4 flex-row justify-end">
          <Text className="text-xl font-bold text-foreground">
            Total: CHF {summary.betrag.toFixed(2)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
