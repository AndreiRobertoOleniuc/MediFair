import React, { useEffect } from "react";
import {
  View,
  SafeAreaView,
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
import {
  deleteDocument,
  fetchDocuments,
} from "~/store/asyncThunks/documentThunks";
import { Document } from "@/models/Document";

export default function Documents() {
  const documents = useAppSelector((state) => state.document.documents);
  const { colors } = useColorScheme();
  const dispatch = useAppDispatch();
  const [isDeleteOn, setIsDeleteOn] = React.useState(false);

  const deleteDocumentInView = (document: Document) => {
    dispatch(deleteDocument(document)).finally(() => {
      dispatch(fetchDocuments());
    });
  };

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 p-5">
        <View className="flex-row justify-between items-center mb-4">
          <Text variant="title1" className="text-center font-black">
            Rechnungen
          </Text>
          <TouchableOpacity onPress={() => setIsDeleteOn(!isDeleteOn)}>
            <MaterialIcon name="edit" size={20} color={colors.grey} />
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-1">
          {documents.length === 0 ? (
            <Text>Keine Rechnung sind hinzugefügt worden</Text>
          ) : (
            documents.map((document) => {
              if (isDeleteOn) {
                return (
                  <View className="flex flex-col w-full mb-4" key={document.id}>
                    <Text className="text-sm text-gray-500">
                      {document.scanResponse?.overallSummary.datum}
                    </Text>
                    <View className="flex-row items-center justify-between w-full">
                      <Text
                        numberOfLines={1}
                        className="truncate text-lg max-w-[90%]"
                      >
                        {document?.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => deleteDocumentInView(document)}
                      >
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
                      <Text
                        numberOfLines={1}
                        className="truncate text-lg max-w-[90%]"
                      >
                        {document?.name}
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
          Alle Daten werden lokal auf Ihrem Gerät gespeichert und niemals auf
          einem Server übertragen.
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
