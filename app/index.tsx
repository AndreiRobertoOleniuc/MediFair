import { Link } from "expo-router";
import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

import { Button } from "../components/nativewindui/Button";
import { Text } from "../components/nativewindui/Text";
import { useColorScheme } from "../hooks/useColorScheme";

export default function WelcomeConsentScreen() {
  const { colors } = useColorScheme();
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="mx-auto max-w-sm flex-1 justify-between gap-4 px-8 py-4">
        <View className="pt-12">
          <Text variant="largeTitle" className="text-center font-bold">
            Willkommen bei
          </Text>
          <Text
            variant="largeTitle"
            className="text-center text-primary font-bold"
          >
            Medifair
          </Text>
        </View>
        <View className="gap-8">
          {FEATURES.map((feature) => (
            <View key={feature.title} className="flex-row gap-4">
              <View className="pt-px">
                <MaterialIcon
                  name={feature.icon}
                  size={38}
                  color={colors.primary}
                />
              </View>
              <View className="flex-1">
                <Text className="font-bold">{feature.title}</Text>
                <Text variant="footnote">{feature.description}</Text>
              </View>
            </View>
          ))}
        </View>
        <View className="gap-4">
          <View className="items-center">
            <MaterialIcon name="group" size={24} color={colors.primary} />
            <Text variant="caption2" className="pt-1 text-center">
              Durch Drücken von "Weiter" stimmen Sie unseren{" "}
              <Link href="/">
                <Text variant="caption2" className="text-primary">
                  Nutzungsbedingungen
                </Text>
              </Link>{" "}
              zu und bestätigen, dass Sie unsere{" "}
              <Link href="/">
                <Text variant="caption2" className="text-primary">
                  Datenschutzrichtlinie
                </Text>
              </Link>{" "}
              gelesen haben.
            </Text>
          </View>
          <Link href="/document" replace asChild>
            <Button size={Platform.select({ default: "md", ios: "md" })}>
              <Text>Weiter</Text>
            </Button>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const FEATURES = [
  {
    title: "TARMED-Rechnungen scannen",
    description:
      "Fotografieren Sie Ihre TARMED-Rückforderungsbelege und lassen Sie sie automatisch analysieren.",
    icon: "document-scanner",
  },
  {
    title: "Leistungen zusammenfassen",
    description:
      "Erhalten Sie eine klare Übersicht über alle vom Arzt erbrachten Leistungen.",
    icon: "description",
  },
  {
    title: "Komplexe Begriffe erklären",
    description:
      "Verstehen Sie medizinische Fachbegriffe durch einfache Erklärungen.",
    icon: "help",
  },
  {
    title: "Datenschutz und Sicherheit",
    description:
      "Alle Daten werden ausschließlich lokal auf Ihrem Gerät gespeichert und nie auf einen Server übertragen.",
    icon: "cloud-off",
  },
] as const;
