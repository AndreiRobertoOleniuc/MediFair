import React from "react";
import { View, SafeAreaView, Platform, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useAppSelector } from "@/store/hooks";
import { Button } from "../components/nativewindui/Button";
import { Text } from "../components/nativewindui/Text";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";
import { useColorScheme } from "../lib/useColorScheme";
import { router } from "expo-router";

export default function Document() {
  const documents = useAppSelector((state) => state.document.documents);
  const { colors } = useColorScheme();

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 p-5">
        <Text
          variant="title1"
          className="text-center font-bold ios:text-left ios:font-black mb-4"
        >
          Rechnungen
        </Text>
        <View className="flex-1 gap-4">
          {documents.map((document) => (
            <TouchableOpacity
              className="flex flex-row items-center justify-between w-full"
              key={document.id}
              onPress={() => {
                router.push({
                  pathname: "/document/[id]",
                  params: { id: document.id },
                });
              }}
            >
              <Text className="text-lg">{document?.name}</Text>
              <MaterialIcon
                name="arrow-forward-ios"
                size={13}
                color={colors.primary}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View className="p-5">
        <Link href="/scanner" asChild>
          <Button size={Platform.select({ ios: "lg", default: "md" })}>
            <Text>Rechnung Scannen</Text>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
