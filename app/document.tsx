import React, { useEffect } from "react";
import {
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Button } from "../components/nativewindui/Button";
import { Text } from "../components/nativewindui/Text";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "../hooks/useColorScheme";
import { router } from "expo-router";
import { fetchDocuments } from "~/store/asyncThunks/documentThunks";

export default function Documents() {
  const documents = useAppSelector((state) => state.document.documents);
  const { colors } = useColorScheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-5">
        <Text
          variant="title1"
          className="text-center font-bold ios:text-left ios:font-black mb-4"
        >
          Rechnungen
        </Text>
        <ScrollView className="flex-1 gap-4">
          {documents.length === 0 ? (
            <Text>Keine Rechnung sind hinzugefügt worden</Text>
          ) : (
            documents.map((document) => (
              <TouchableOpacity
                className="flex flex-col w-full"
                key={document.id}
                onPress={() => {
                  router.push({
                    pathname: "/document/[id]",
                    params: { id: document.id },
                  });
                }}
              >
                <Text className="text-sm text-gray-500">
                  {document.scanResponse?.overallSummary.datum}
                </Text>
                <View className="flex-row items-center justify-between w-full">
                  <Text className="text-lg">{document?.name}</Text>
                  <MaterialIcon
                    name="arrow-forward-ios"
                    size={13}
                    color={colors.primary}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
      <View className="p-5">
        <Text className="text-xs text-gray-400 text-center mb-2">
          Alle Daten werden lokal auf Ihrem Gerät gespeichert und niemals auf
          einem Server übertragen.
        </Text>
        <Link href="/scanner" asChild>
          <Button size={Platform.select({ ios: "lg", default: "md" })}>
            <Text>Rechnung Scannen</Text>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
