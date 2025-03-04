import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useCameraPermissions } from "expo-camera";
import CameraComponent from "../screens/Scanning/CameraComponent";
import PreviewComponent from "../screens/Scanning/PreviewComponent";
import { router } from "expo-router";
import { useAppDispatch } from "@/store/hooks";
import { analyzeDocument } from "~/store/asyncThunks/documentThunks";

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      if (!permission || !permission.granted) {
        await requestPermission();
      }
    })();
  }, []);

  const continueWithImages = async () => {
    if (capturedPhotos.length > 0) {
      try {
        // First navigate to document detail page - it will show loading skeleton
        const tempId = -1; // Temporary ID until real ID is known
        router.replace({
          pathname: "/document/[id]",
          params: { id: tempId },
        });

        // Then dispatch thunk with captured photos
        const resultAction = await dispatch(analyzeDocument(capturedPhotos));

        if (analyzeDocument.fulfilled.match(resultAction)) {
          // Update navigation to the correct document ID
          router.replace({
            pathname: "/document/[id]",
            params: { id: resultAction.payload.id },
          });
        } else {
          console.error("Failed to analyze document:", resultAction.payload);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!permission) {
    return <View />;
  }

  if (showCamera && capturedPhotos.length === 0) {
    return (
      <CameraComponent
        onCapture={(photos: string[]) => {
          setCapturedPhotos(photos);
          setShowCamera(false);
        }}
      />
    );
  }

  return (
    <PreviewComponent
      photoUris={capturedPhotos}
      onRetake={() => {
        setCapturedPhotos([]);
        setShowCamera(true);
      }}
      onContinue={() => continueWithImages()}
    />
  );
}
