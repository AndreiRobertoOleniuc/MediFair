import React from "react";
import { View, Button, StyleSheet, Text, SafeAreaView } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Tarmed Validation Tool</Text>
      <Link href="/documents" asChild>
        <Button title="Get Started" />
      </Link>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    color: "black",
  },
});
