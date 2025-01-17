import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { useAppSelector } from "@/store/hooks";

export default function Document() {
  const documents = useAppSelector((state) => state.document.documents);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Scanned Document</Text>
        <View style={styles.documents}>
          {documents.map((document) => (
            <Link
              key={document.id}
              style={styles.documentItem}
              href={{
                pathname: "/document/[id]",
                params: { id: document.id },
              }}
            >
              <Text style={styles.documentText}>Document {document.id}</Text>
            </Link>
          ))}
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Link href="/scanner" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Open Scanner</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333333",
  },
  documents: {
    flex: 1,
    marginTop: 10,
  },
  documentItem: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  documentText: {
    fontSize: 16,
    color: "#333333",
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
