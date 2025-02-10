import React, { useEffect } from "react";
import { View } from "react-native";
import { CameraCapturedPicture } from "expo-camera";
import DocumentScanner from "react-native-document-scanner-plugin";
import { router } from "expo-router";
import { Secrets } from "@/Secrets";

interface CameraComponentProps {
  onCapture: (photos: CameraCapturedPicture[]) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const scanDocument = async () => {
    try {
      const { scannedImages } = await DocumentScanner.scanDocument({
        maxNumDocuments: 5, // allow up to 5 pages
      });
      if (scannedImages && scannedImages.length > 0) {
        const photos: CameraCapturedPicture[] = scannedImages.map(
          (uri: string) => ({
            uri,
            width: 0,
            height: 0,
          })
        );
        onCapture(photos);
      }
    } catch (error) {
      if (Secrets.disableScan) {
        onCapture([
          {
            uri: "https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/thumbnails/image/file.jpg",
            width: 0,
            height: 0,
          },
        ]);
      } else {
        console.error("Error scanning document:", error);
        router.replace("/document");
      }
    }
  };

  useEffect(() => {
    scanDocument();
  }, []);

  return <View />;
};

export default CameraComponent;
