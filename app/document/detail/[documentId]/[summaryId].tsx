import React, { useState } from "react";
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
import { Dialog } from "~/components/custom/Dialog";
import { Skeleton } from "~/components/custom/Skeleton";

export default function DocumentDetail() {
  const { documentId, summaryId } = useLocalSearchParams();
  const document = useAppSelector(selectDocumentById(Number(documentId)));
  const explanation = useAppSelector(selectTarmedPositionExplanation);
  const status = useAppSelector(selectDocumentStatus);
  const { colors } = useColorScheme();
  const dispatch = useAppDispatch();

  // Local state to control dialog visibility
  const [dialogVisible, setDialogVisible] = useState(false);

  const fetchExplanation = async (tarmedPosition: TarmedPosition) => {
    setDialogVisible(true);
    await dispatch(explainPosition(tarmedPosition));
  };

  // Early returns for error states
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

  const { original, summaries } = scanResponse;
  const summaryIndex = parseInt(summaryId as string, 10);
  const summary = summaries?.[summaryIndex];

  if (!summary) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <Text className="text-foreground">Summary not found</Text>
      </SafeAreaView>
    );
  }

  const relevantOriginals = summary.relevant_ids.map(
    (origIndex: number) => original[origIndex]
  );

  // Determine dialog title based on state
  const dialogTitle =
    status === "succeeded" && explanation ? explanation.titel : "Loading...";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Dialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        title={dialogTitle}
        size="md"
      >
        {status === "loading" && (
          <View className="space-y-4">
            <Skeleton variant="text" size="md" className="w-4/5 h-4" />
          </View>
        )}

        {status === "succeeded" && explanation && (
          <Text className="text-foreground">{explanation.erklärung}</Text>
        )}

        {status === "failed" && (
          <Text className="text-destructive">
            Failed to load explanation. Please try again.
          </Text>
        )}
      </Dialog>

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
              <Text className="text-xl font-semibold text-foreground flex-1 mr-2">
                {item.titel}
              </Text>
              <Text className="text-base text-muted-foreground justify-start">
                CHF {item.betrag.toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm text-foreground mt-1 w-3/4">
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
