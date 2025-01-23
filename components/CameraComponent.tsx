import React, { useEffect } from "react";
import { View } from "react-native";
import { CameraCapturedPicture } from "expo-camera";
import DocumentScanner, {
  ScanDocumentResponse,
} from "react-native-document-scanner-plugin";
import { router } from "expo-router";

interface CameraComponentProps {
  onCapture: (photoUri: CameraCapturedPicture) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const scanDocument = async () => {
    try {
      const { scannedImages } = await DocumentScanner.scanDocument({
        maxNumDocuments: 2,
      });
      if (scannedImages && scannedImages.length > 0) {
        onCapture({ uri: scannedImages[0], width: 0, height: 0 });
      }
    } catch (error) {
      console.error("Error scanning document:", error);
      router.replace("/document");
    }
  };

  useEffect(() => {
    scanDocument();
  }, []);

  return <View></View>;
};

export default CameraComponent;
