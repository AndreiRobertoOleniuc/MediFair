import { Link } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaViewComponent } from "~/components/custom/SafeAreaComponent";
import MaterialIcon from "@expo/vector-icons/MaterialIcons";

import { Button } from "../components/nativewindui/Button";
import { Text } from "../components/nativewindui/Text";
import { useColorScheme } from "../hooks/useColorScheme";

//DB
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useSQLiteContext } from "expo-sqlite";

export default function WelcomeConsentScreen() {
  const db = useSQLiteContext();
  useDrizzleStudio(db);
  const { colors } = useColorScheme();

  return (
    <SafeAreaViewComponent className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-between px-4 py-8">
          <View>
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

          <View className="gap-8 mt-8">
            {FEATURES.map((feature) => (
              <View
                key={feature.title}
                className="flex-row flex-wrap gap-4 items-start"
              >
                <MaterialIcon
                  name={feature.icon}
                  size={38}
                  color={colors.primary}
                />
                <View className="flex-1">
                  <Text className="font-bold">{feature.title}</Text>
                  <Text variant="footnote">{feature.description}</Text>
                </View>
              </View>
            ))}
          </View>

          <View className="gap-4 mt-8">
            <View className="items-center px-2">
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
              <Button size="md">
                <Text>Weiter</Text>
              </Button>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaViewComponent>
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
    description: "Alle Daten werden nur lokal auf Ihrem Gerät gespeichert.",
    icon: "cloud-off",
  },
] as const;
