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
      <Text style={styles.title}>Preview Scanned Document</Text>
      <View style={styles.imageContainer}>
        <Image source={{ uri: photoUri }} style={styles.image} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onRetake}
          style={[styles.button, styles.retakeButton]}
        >
          <Text style={styles.buttonText}>Retake Picture</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onContinue}
          style={[styles.button, styles.continueButton]}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333333",
  },
  imageContainer: {
    width: 300,
    height: 400,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ECECEC",
    marginBottom: 30,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  retakeButton: {
    backgroundColor: "#FF6B6B",
  },
  continueButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default PreviewComponent;
