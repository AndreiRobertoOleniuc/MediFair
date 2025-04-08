import React from "react";
import { View, Image, ScrollView } from "react-native";
import { Button } from "../../components/nativewindui/Button";
import { Text } from "@/components/nativewindui/Text";
import { SafeAreaViewComponent } from "~/components/custom/SafeAreaComponent";

interface PreviewComponentProps {
  photoUris: string[];
  onRetake: () => void;
  onContinue: () => void;
}

const PreviewComponent: React.FC<PreviewComponentProps> = ({
  photoUris,
  onRetake,
  onContinue,
}) => {
  return (
    <SafeAreaViewComponent className="bg-background flex-1 flex justify-center flex-col">
      <View>
        <Text variant="title1" className="text-center font-bold mb-4">
          Rechnungs Vorschau
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
          className="mb-8 self-center"
        >
          {photoUris.map((uri, index) => (
            <View
              key={index}
              className="w-[300px] h-[400px] bg-card justify-center items-center rounded-lg border border-border mr-3"
            >
              <Image
                source={{ uri }}
                className="w-full h-full rounded-lg"
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>

        <View className="flex-row justify-center gap-4 w-full">
          <Button size="md" variant="secondary" onPress={onRetake}>
            <Text>Erneut Scannen</Text>
          </Button>

          <Button size="md" onPress={onContinue}>
            <Text>Analysieren</Text>
          </Button>
        </View>
      </View>
    </SafeAreaViewComponent>
  );
};

export default PreviewComponent;
