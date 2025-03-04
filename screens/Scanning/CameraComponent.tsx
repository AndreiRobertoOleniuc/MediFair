import React, { useEffect } from "react";
import { View } from "react-native";
import DocumentScanner from "react-native-document-scanner-plugin";
import { router } from "expo-router";

interface CameraComponentProps {
  onCapture: (photos: string[]) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const scanDocument = async () => {
    try {
      const { scannedImages } = await DocumentScanner.scanDocument({
        maxNumDocuments: 1,
      });
      if (scannedImages && scannedImages.length > 0) {
        onCapture(scannedImages);
      }
    } catch (error) {
      console.error("Error scanning document:", error);
      router.replace("/document");
    }
  };

  useEffect(() => {
    scanDocument();
  }, []);

  return <View />;
};

export default CameraComponent;
