import React from "react";
import { View, Button, StyleSheet, Text, SafeAreaView } from "react-native";
import { Link } from "expo-router";
import { useAppSelector, useAppDispatch } from "../store/hooks"; // Adjust the path as necessary
import {
  increment,
  decrement,
  incrementByAmount,
} from "../store/reducers/exampleReducer"; // Import your actions

export default function Index() {
  const value = useAppSelector((state) => state.example.value);
  const dispatch = useAppDispatch();

  return (
    <SafeAreaView style={styles.container}>
      <Text>Tarmed Validation Tool</Text>
      <Link href="/documents" asChild>
        <Button title="Get Started" />
      </Link>
      {/* <Text>{value}</Text>
      <Button onPress={() => dispatch(increment())} title="Increment" />
      <Button onPress={() => dispatch(decrement())} title="Decrement" />
      <Button
        onPress={() => dispatch(incrementByAmount(5))}
        title="Increment by 5"
      /> */}
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
