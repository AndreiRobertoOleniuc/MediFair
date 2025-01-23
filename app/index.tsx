import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    // <SafeAreaView style={styles.container}>
    //   <Text style={styles.title}>Tarmed Validation Scanner</Text>
    //   <Text style={styles.subtitle}>
    //     Hilft bei der Validation der Rückforderungsbelege
    //   </Text>
    //   <Link href="/document" asChild>
    //     <TouchableOpacity style={styles.button}>
    //       <Text style={styles.buttonText}>Get Started</Text>
    //     </TouchableOpacity>
    //   </Link>
    // </SafeAreaView>
    <SafeAreaView className="bg-primary h-full flex justify-center items-center">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full items-center justify-center min-h-[85vh] px-4">
          <Text className="text-white text-3xl">Tarmed Validation Scanner</Text>
        </View>
        <Text className="text-sm  text-gray-100 mt-7 text-center">
          Hilft bei der Validation der Rückforderungsbelege
        </Text>
      </ScrollView>
      <StatusBar backgroundColor="#161622" barStyle="light-content" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000000",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    color: "#000000",
  },
  button: {
    backgroundColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#000000",
  },
});
