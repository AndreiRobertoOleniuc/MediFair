import React from "react";
import { View, SafeAreaView, TouchableOpacity, ScrollView } from "react-native";
import { Link } from "expo-router";
import { Button } from "../components/nativewindui/Button";
import { Text } from "../components/nativewindui/Text";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "../hooks/useColorScheme";
import { router } from "expo-router";

import { Invoice } from "~/db/schema";

import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

export default function Documents() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const { data }: { data: Invoice[] } = useLiveQuery(
    drizzleDb.query.invoice.findMany()
  );
  const { colors } = useColorScheme();
  const [isDeleteOn, setIsDeleteOn] = React.useState(false);

  const deleteInvoice = async (invoice: Invoice) => {
    try {
      await drizzleDb.transaction(async (tx) => {
        // 1. Get all summaries related to this invoice
        const relatedSummaries = await tx.query.summeries.findMany({
          where: (summeries, { eq }) => eq(summeries.invoiceid, invoice.id),
        });

        // 2. For each summary, delete related summariesToPositions entries
        for (const summary of relatedSummaries) {
          await tx
            .delete(schema.summeriesToPositions)
            .where(eq(schema.summeriesToPositions.summeries_id, summary.id));
        }

        // 3. Delete all summaries related to this invoice
        await tx
          .delete(schema.summeries)
          .where(eq(schema.summeries.invoiceid, invoice.id));

        // 4. Finally delete the invoice itself
        await tx
          .delete(schema.invoice)
          .where(eq(schema.invoice.id, invoice.id));

        // No need to refresh data since you're using useLiveQuery
      });
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-5">
        <View className="flex-row justify-between items-center mb-4">
          <Text variant="title1" className="text-center font-black">
            Rechnungen
          </Text>
          {data.length > 0 && (
            <TouchableOpacity onPress={() => setIsDeleteOn(!isDeleteOn)}>
              {isDeleteOn ? (
                <MaterialIcon name="check" size={20} color={colors.grey} />
              ) : (
                <MaterialIcon name="edit" size={20} color={colors.grey} />
              )}
            </TouchableOpacity>
          )}
        </View>
        <ScrollView className="flex-1">
          {data.length === 0 ? (
            <Text>Keine Rechnung sind hinzugefügt worden</Text>
          ) : (
            data.map((invoice) => {
              if (isDeleteOn) {
                return (
                  <View className="flex flex-col w-full mb-4" key={invoice.id}>
                    <Text className="text-sm text-gray-500">
                      {invoice.datum}
                    </Text>
                    <View className="flex-row items-center justify-between w-full">
                      <Text
                        numberOfLines={1}
                        className="truncate text-lg max-w-[90%]"
                      >
                        {invoice.titel}
                      </Text>
                      <TouchableOpacity onPress={() => deleteInvoice(invoice)}>
                        <MaterialIcon
                          name="delete"
                          size={15}
                          color={colors.destructive}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              } else {
                return (
                  <TouchableOpacity
                    className="flex flex-col w-full mb-4"
                    key={invoice.id}
                    onPress={() => {
                      router.push({
                        pathname: "/document/[id]",
                        params: { id: invoice.id },
                      });
                    }}
                  >
                    <Text className="text-sm text-gray-500">
                      {invoice.datum}
                    </Text>
                    <View className="flex-row items-center justify-between w-full">
                      <Text
                        numberOfLines={1}
                        className="truncate text-lg max-w-[90%]"
                      >
                        {invoice.titel}
                      </Text>
                      <MaterialIcon
                        name="arrow-forward-ios"
                        size={15}
                        color={colors.primary}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }
            })
          )}
        </ScrollView>
      </View>
      <View className="p-5">
        <Text className="text-xs text-gray-400 text-center mb-2">
          Alle Daten werden nur lokal auf Ihrem Gerät gespeichert.
        </Text>
        <Link href="/scanner" asChild>
          <Button size="lg">
            <Text>Rechnung Scannen</Text>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
