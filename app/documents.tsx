import { View, Button, Text, StyleSheet, SafeAreaView } from "react-native";
import { Link } from "expo-router";

export default function Documents() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add New Scanned Document</Text>
        <View style={styles.documents}>
          <Text>Document 1</Text>
          <Text>Document 2</Text>
          <Text>Document 3</Text>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Link href="/scanner" asChild>
          <Button title="Open Scanner" />
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  documents: {
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  bottomContainer: {
    padding: 20,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
