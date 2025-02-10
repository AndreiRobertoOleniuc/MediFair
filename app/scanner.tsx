import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { CameraCapturedPicture, useCameraPermissions } from "expo-camera";
import CameraComponent from "../components/Scanning/CameraComponent";
import PreviewComponent from "../components/Scanning/PreviewComponent";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Document, ScanResponse } from "@/models/Document";
import { addDocument } from "@/store/reducers/docuemtReducer";
import { documentApi } from "@/services/api";
import DemoData from "@/assets/data/sampleInvoiceV2.3.json";

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhotos, setCapturedPhotos] = useState<CameraCapturedPicture[]>(
    []
  );
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
        // For multi page scanning, you might want to handle uploading multiple images.
        // Here we use demo data for illustration.
        let response: ScanResponse = JSON.parse(JSON.stringify(DemoData));
        const document: Document = {
          id: documents.length.toString(),
          name: response.overallSummary.titel,
          documemtImages: capturedPhotos, // store all pages images
          scanResponse: response,
        };
        dispatch(addDocument(document));
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
        onCapture={(photos: CameraCapturedPicture[]) => {
          setCapturedPhotos(photos);
          setShowCamera(false);
        }}
      />
    );
  }

  return (
    <PreviewComponent
      photoUris={capturedPhotos.map((photo) => photo.uri)}
      onRetake={() => {
        setCapturedPhotos([]);
        setShowCamera(true);
      }}
      onContinue={() => continueWithImages()}
    />
  );
}
