import React from "react";
import { useAppSelector } from "@/store/hooks";
import { selectDocumentById } from "@/store/selectors/documentSelectors";
import { useLocalSearchParams, Link } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  SafeAreaView,
  Image,
  Button,
} from "react-native";
import { useRouter } from "expo-router";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const document = useAppSelector(selectDocumentById(id as string));
  const router = useRouter();

  if (!document || !document.scanResponse) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text>Document not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { summaries } = document.scanResponse;
  const photoUri = document.documemtImages?.[0]?.uri;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imagePreviewContainer}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.image} />
        ) : (
          <View style={styles.imageFallback}>
            <Text style={styles.imageFallbackText}>Kein Bild verfügbar</Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.subheading}>Zusammenfassung / Erklärung</Text>
        {summaries.map((summary, index) => (
          <View key={index} style={styles.summary}>
            <Text style={styles.summaryText}>Datum: {summary.datum}</Text>
            <Text style={styles.summaryText}>
              Beschreibung: {summary.beschreibung}
            </Text>
            <Text style={styles.summaryText}>
              Betrag: {summary.betrag.toFixed(2)} CHF
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    padding: 10,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
    marginTop: 10,
    marginLeft: 10,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  imagePreviewContainer: {
    height: "40%",
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  imageFallback: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ECECEC",
  },
  imageFallbackText: {
    fontSize: 16,
    color: "#999",
  },
  scrollContainer: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 4,
  },
  header: {
    fontWeight: "bold",
  },
  summary: {
    padding: 8,
    backgroundColor: "#F9F9F9",
    marginVertical: 4,
    borderRadius: 4,
  },
  summaryText: {
    fontSize: 14,
  },
});
