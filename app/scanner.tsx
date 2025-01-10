import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useCameraPermissions } from "expo-camera";
import CameraComponent from "../components/CameraComponent";
import PreviewComponent from "../components/PreviewComponent";
import { router } from "expo-router";

const Scanner: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (!permission || !permission.granted) {
        await requestPermission();
      }
    })();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (showCamera && !capturedPhotoUri) {
    return (
      <CameraComponent
        onCapture={(uri) => {
          setCapturedPhotoUri(uri);
          setShowCamera(false);
        }}
      />
    );
  }

  return (
    <PreviewComponent
      photoUri={capturedPhotoUri!}
      onRetake={() => {
        setCapturedPhotoUri(null);
        setShowCamera(true);
      }}
      onContinue={() => {
        router.replace("/documents");
      }}
    />
  );
};

export default Scanner;
