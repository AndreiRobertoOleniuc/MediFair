import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";

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
    <View style={styles.previewContainer}>
      <Image source={{ uri: photoUri }} style={styles.image} />
      <TouchableOpacity onPress={onRetake} style={styles.button}>
        <Text>Retake Picture</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onContinue} style={styles.button}>
        <Text>Continue with Picture</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },
  image: {
    width: 300,
    height: 400,
    resizeMode: "contain",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
  },
});

export default PreviewComponent;
