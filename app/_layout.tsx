import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";
import store from "../store/store"; // Adjust the path as necessary

import { Button } from "react-native";
import { useRouter } from "expo-router";

import "../global.css";
import "expo-dev-client";

import { ThemeProvider as NavThemeProvider } from "@react-navigation/native";

import {
  useColorScheme,
  useInitialAndroidBarSync,
} from "../lib/useColorScheme";
import { NAV_THEME } from "../theme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
        </Stack>
      </NavThemeProvider>
      <StatusBar
        key={`root-status-bar-${isDarkColorScheme ? "light" : "dark"}`}
        style={isDarkColorScheme ? "light" : "dark"}
      />
    </Provider>
  );
}
