import React from "react";
import { View, Image, Platform } from "react-native";
import { Button } from "@/components/nativewindui/Button";
import { Text } from "@/components/nativewindui/Text";

interface PreviewComponentProps {
  photoUri: string;
  onRetake: () => void;
  onContinue: () => void;
}

const PreviewComponent: React.FC<PreviewComponentProps> = ({
  photoUri,
  onRetake,
  onContinue,
}) => {
  return (
    <View className="flex-1 justify-center items-center bg-background p-5">
      <Text
        variant="title1"
        className="text-center font-bold ios:text-left ios:font-black mb-4"
      >
        Rechnungs Vorschau
      </Text>

      <View className="w-[300px] h-[400px] bg-card justify-center items-center rounded-lg border border-border mb-8">
        <Image
          source={{ uri: photoUri }}
          className="w-full h-full rounded-lg"
          resizeMode="contain"
        />
      </View>

      <View className="flex-row justify-between w-full gap-3">
        <Button
          variant="secondary"
          size={Platform.select({ ios: "lg", default: "md" })}
          className="flex-1"
          onPress={onRetake}
        >
          <Text>Erneut Scannen</Text>
        </Button>

        <Button
          size={Platform.select({ ios: "lg", default: "md" })}
          className="flex-1"
          onPress={onContinue}
        >
          <Text>Analysieren</Text>
        </Button>
      </View>
    </View>
  );
};

export default PreviewComponent;
