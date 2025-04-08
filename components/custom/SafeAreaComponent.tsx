import { Platform } from "react-native";
import { SafeAreaView as SafeAreaViewAndroid } from "react-native-safe-area-context";
import { SafeAreaView as SafeAreaViewIos } from "react-native";

export const SafeAreaViewComponent =
  Platform.OS === "ios" ? SafeAreaViewIos : SafeAreaViewAndroid;
