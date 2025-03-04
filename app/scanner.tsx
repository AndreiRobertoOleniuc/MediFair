import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useCameraPermissions } from "expo-camera";
import CameraComponent from "../screens/Scanning/CameraComponent";
import PreviewComponent from "../screens/Scanning/PreviewComponent";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Document, ScanResponse } from "@/models/Document";
import { documentApi } from "@/services/api";
import DemoData from "@/assets/data/sampleInvoiceV3.1.json";
import { insertDocument } from "~/store/asyncThunks/documentThunks";

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState<boolean>(true);
  const documents = useAppSelector((state) => state.document.documents);
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
        let response: ScanResponse = JSON.parse(JSON.stringify(DemoData));
        // let response: ScanResponse = await documentApi.analyseDocument(
        //   capturedPhotos[0]
        // );
        const document: Document = {
          id: documents.length,
          name: response.overallSummary.titel,
          imageUris: capturedPhotos,
          scanResponse: response,
        };
        dispatch(insertDocument(document));
        router.replace({
          pathname: "/document/[id]",
          params: { id: document.id },
        });
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
