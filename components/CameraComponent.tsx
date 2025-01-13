import React, { useEffect, useState } from "react";
import { Image, View, StyleSheet, ImageStyle, Button } from "react-native";
import { CameraCapturedPicture } from "expo-camera";
import DocumentScanner from "react-native-document-scanner-plugin";
import { router } from "expo-router";

interface CameraComponentProps {
  onCapture: (photoUri: CameraCapturedPicture) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const [scannedImage, setScannedImage] = useState<string | null>(null);

  const scanDocument = async () => {
    try {
      const { scannedImages } = await DocumentScanner.scanDocument({
        maxNumDocuments: 2,
      });
      if (scannedImages && scannedImages.length > 0) {
        setScannedImage(scannedImages[0]);
      }
    } catch (error) {
      console.error("Error scanning document:", error);
      router.replace("/documents");
    }
  };

  useEffect(() => {
    scanDocument();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.image}
        source={{ uri: scannedImage || undefined }}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Continue with Scan"
          onPress={() => {
            if (scannedImage) {
              onCapture({ uri: scannedImage, width: 0, height: 0 });
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    marginBottom: 16,
  } as ImageStyle,
  buttonContainer: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
});

export default CameraComponent;
