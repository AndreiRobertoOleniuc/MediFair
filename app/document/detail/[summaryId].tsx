import React, { useState } from "react";
import { View, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text } from "@/components/nativewindui/Text";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Dialog } from "~/components/custom/Dialog";
import { Skeleton } from "~/components/custom/Skeleton";

import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { Explanation } from "~/models/ApiResponse";
import { InvoicePositions } from "@/db/schema";
import { documentApi } from "~/services/api";

export default function SummaryDetail() {
  const { summaryId } = useLocalSearchParams();

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const { colors } = useColorScheme();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [explanationStatus, setExplanationStatus] = useState<
    "loading" | "succeeded" | "failed"
  >("loading");
  const [explanation, setExplanation] = useState<Explanation>();

  const { data, error } = useLiveQuery(
    drizzleDb
      .select()
      .from(schema.summeriesToPositions)
      .leftJoin(
        schema.invoicePositions,
        eq(
          schema.invoicePositions.id,
          schema.summeriesToPositions.invoicePositions_id
        )
      )
      .leftJoin(
        schema.summeries,
        eq(schema.summeries.id, schema.summeriesToPositions.summeries_id)
      )
      .where(eq(schema.summeriesToPositions.summeries_id, Number(summaryId)))
  );

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error beim laden der datan: {error.message}</Text>
      </View>
    );
  }

  if (data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Keine Daten gefunden</Text>
      </View>
    );
  }

  const fetchExplanation = async (procedureItem: InvoicePositions) => {
    setDialogVisible(true);
    setExplanationStatus("loading");
    try {
      const response: Explanation = await documentApi.fetchExplainPosition({
        beschreibung: procedureItem.beschreibung || "",
        betrag: procedureItem.betrag,
        datum: procedureItem.datum,
        tarifziffer: procedureItem.tarifziffer || "",
        anzahl: procedureItem.anzahl,
        tarif: procedureItem.tarif || "",
        titel: procedureItem.titel,
        interpretation: procedureItem.interpretation || "",
      });
      setExplanation(response);
      setExplanationStatus("succeeded");
    } catch (error) {
      console.log("Error fetching explanation", error);
      setExplanationStatus("failed");
    }
  };

  // Determine dialog title based on state
  const dialogTitle =
    explanationStatus === "succeeded" && explanation
      ? explanation.titel
      : "Loading...";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <View className="flex-row justify-between items-start">
            <Text className="text-xl font-bold text-foreground w-3/4">
              {data[0].summeries?.emoji} {data[0].summeries?.titel}
            </Text>
            <Text className="text-sm text-muted-foreground">
              {data[0].summeries?.datum}
            </Text>
          </View>
          <Text className="mt-2 text-foreground">
            {data[0].summeries?.beschreibung}
          </Text>
        </View>

        {data.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                marginBottom: 20,
                marginTop: 4,
                position: "relative",
              }}
            >
              {(item.invoicePositions?.anzahl || 1) > 1 && (
                <>
                  <View
                    className="bg-card/50 w-[96%] rounded-md absolute left-[2%]"
                    style={{
                      height: "88%",
                      top: -10,
                      transform: [{ rotate: "-1.5deg" }],
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  />
                  <View
                    className="bg-card/70 w-[97%] rounded-md absolute left-[1.5%]"
                    style={{
                      height: "92%",
                      top: -6,
                      transform: [{ rotate: "1deg" }],
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.15,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  />
                  <View
                    className="bg-card/85 w-[98.5%] rounded-md absolute left-[0.75%]"
                    style={{
                      height: "96%",
                      top: -3,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.2,
                      shadowRadius: 2,
                      elevation: 3,
                    }}
                  />
                </>
              )}

              <View className="bg-card w-full rounded-md px-4 py-3 drop-shadow-xs">
                <View className="flex-row">
                  <Text className="text-xl font-semibold text-foreground flex-1 mr-2">
                    {item.invoicePositions?.titel}
                  </Text>
                  <Text className="text-base text-muted-foreground justify-start">
                    CHF{" "}
                    {(
                      (item.invoicePositions?.betrag || 0) *
                      (item.invoicePositions?.anzahl || 1)
                    ).toFixed(2)}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <View className="w-3/4">
                    <Text className="text-sm text-foreground mt-1">
                      {item.invoicePositions?.beschreibung}
                    </Text>
                    {(item.invoicePositions?.anzahl || 1) > 1 &&
                      item.invoicePositions?.betrag != null && (
                        <Text className="text-sm text-primary font-medium mt-1">
                          {item.invoicePositions.anzahl}x à CHF{" "}
                          {item.invoicePositions.betrag.toFixed(2)}
                        </Text>
                      )}
                  </View>
                  <TouchableOpacity
                    onPress={() => fetchExplanation(item.invoicePositions!)}
                  >
                    <MaterialIcon
                      name="help-outline"
                      size={24}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
                <Text className="text-sm text-muted-foreground mt-1">
                  {item.invoicePositions?.tarifziffer}
                </Text>
              </View>
            </View>
          );
        })}

        <View className="mt-4 pt-4 flex-row justify-end">
          <Text className="text-xl font-bold text-foreground">
            Total: CHF {data[0].summeries?.betrag.toFixed(2)}
          </Text>
        </View>
      </ScrollView>
      <Dialog
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false);
          setExplanationStatus("succeeded");
        }}
        title={dialogTitle}
        size="md"
      >
        {explanationStatus === "loading" && (
          <View className="space-y-4">
            <Skeleton variant="text" size="md" className="w-4/5 h-4" />
          </View>
        )}

        {explanationStatus === "succeeded" && explanation && (
          <Text className="text-foreground">{explanation.erklärung}</Text>
        )}

        {explanationStatus === "failed" && (
          <Text className="text-destructive">
            Failed to load explanation. Please try again.
          </Text>
        )}
      </Dialog>
    </SafeAreaView>
  );
}
