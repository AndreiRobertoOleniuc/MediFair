// React Imports
import React, { useEffect } from "react";

// Expo Libraries
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import "expo-dev-client";
import { db } from "@/db/client";
import migrations from "@/drizzle/migrations";

// Expo Router
import { Stack, useRouter } from "expo-router";

// React Native Components & Reanimated
import { Button, View, Text } from "react-native";
import "react-native-reanimated";

// Redux & Navigation
import { Provider } from "react-redux";
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";

// Internal Modules & Assets
import store from "../store/store"; // Adjust the path as necessary
import {
  useColorScheme,
  useInitialAndroidBarSync,
} from "../hooks/useColorScheme";
import { NAV_THEME } from "../theme";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  const { colorScheme, isDarkColorScheme } = useColorScheme();
  useInitialAndroidBarSync();

  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavThemeProvider value={NAV_THEME[colorScheme]}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="scanner" options={{ headerShown: false }} />
          <Stack.Screen name="document" options={{ headerShown: false }} />
          <Stack.Screen
            name="document/[id]"
            options={{
              headerShown: true,
              title: "Rückforderungsbeleg Analysieren",
              headerLeft: () => (
                <Button
                  title="Back"
                  onPress={() => router.dismissTo("/document")}
                />
              ),
            }}
          />
          <Stack.Screen
            name="document/detail/[documentId]/[summaryId]"
            options={{
              headerShown: true,
              title: "",
              headerLeft: () => (
                <Button title="Back" onPress={() => router.back()} />
              ),
            }}
          />
        </Stack>
      </NavThemeProvider>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? "light" : "dark"}`}
        style={isDarkColorScheme ? "light" : "dark"}
      />
    </Provider>
  );
}
