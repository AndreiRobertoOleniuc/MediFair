import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { CameraCapturedPicture, useCameraPermissions } from "expo-camera";
import CameraComponent from "../components/CameraComponent";
import PreviewComponent from "../components/PreviewComponent";
import { router } from "expo-router";

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhotoUri, setCapturedPhotoUri] =
    useState<CameraCapturedPicture | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      if (!permission || !permission.granted) {
        await requestPermission();
      }
    })();
  }, []);

  const uploadImage = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: uri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);

      const response = await fetch("YOUR_API_ENDPOINT", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const continueWithImage = async () => {
    if (capturedPhotoUri) {
      try {
        //await uploadImage(capturedPhotoUri);
        router.replace("/documents");
      } catch (error) {
        console.error("Failed to upload:", error);
      }
    }
  };

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
      photoUri={capturedPhotoUri!.uri}
      onRetake={() => {
        setCapturedPhotoUri(null);
        setShowCamera(true);
      }}
      onContinue={() => continueWithImage()}
    />
  );
}
