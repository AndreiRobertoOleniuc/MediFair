import React from "react";
import { SafeAreaView, View, Image, ScrollView } from "react-native";
import { Button } from "../../components/nativewindui/Button";
import { Text } from "@/components/nativewindui/Text";

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
    <SafeAreaView className="flex-1 bg-background py-10 px-20">
      <View className="flex-1 justify-center items-center py-14">
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
          className="mb-8"
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

        <View className="flex-row justify-between w-full px-9">
          <Button size="md" variant="secondary" onPress={onRetake}>
            <Text>Erneut Scannen</Text>
          </Button>

          <Button size="md" onPress={onContinue}>
            <Text>Analysieren</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PreviewComponent;
