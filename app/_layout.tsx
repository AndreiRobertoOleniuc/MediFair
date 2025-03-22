// React Imports
import React, { Suspense, useEffect } from "react";

// Expo Libraries
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "expo-dev-client";

//DB
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migration from "@/drizzle/migrations";
import { SQLiteProvider, openDatabaseSync } from "expo-sqlite";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

// Expo Router
import { Stack, useRouter } from "expo-router";

// React Native Components & Reanimated
import { Button, ActivityIndicator } from "react-native";
import "react-native-reanimated";

// Redux & Navigation
import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";

// Internal Modules & Assets
import {
  useColorScheme,
  useInitialAndroidBarSync,
} from "../hooks/useColorScheme";
import { NAV_THEME } from "../theme";
import "../global.css";

SplashScreen.preventAutoHideAsync();
const DATABASE_NAME = "medifair.db";

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migration);

  useEffect(() => {
    if (error) {
      console.error("Migration error", error);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      console.log("Migration success", success);
      //addDummyData(db);
    }
  }, [success]);

  const { colorScheme, isDarkColorScheme, colors } = useColorScheme();
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

  return (
    <Suspense fallback={<ActivityIndicator size="large" />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{ enableChangeListener: true }}
        useSuspense
      >
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
                    color={colors.primary}
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
                  <Button
                    title="Back"
                    onPress={() => router.back()}
                    color={colors.primary}
                  />
                ),
              }}
            />
          </Stack>
        </NavThemeProvider>
        <StatusBar
          key={`root-status-bar-${isDarkColorScheme ? "light" : "dark"}`}
          style={isDarkColorScheme ? "light" : "dark"}
        />
      </SQLiteProvider>
    </Suspense>
  );
}
