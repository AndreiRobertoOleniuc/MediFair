import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { CameraCapturedPicture, useCameraPermissions } from "expo-camera";
import CameraComponent from "../components/CameraComponent";
import PreviewComponent from "../components/PreviewComponent";
import { router } from "expo-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Document, ScanResponse } from "@/models/Document";
import { addDocument } from "@/store/reducers/docuemtReducer";
import { documentApi } from "@/services/api";
import DemoData from "@/assets/data/exampleResponse.json";

export default function Scanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] =
    useState<CameraCapturedPicture | null>(null);
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

  const continueWithImage = async () => {
    if (capturedPhoto) {
      try {
        //await documentApi.uploadImage(document.documemtImages[0].uri);
        // Use demo data instead of uploading the image, the data is in json so convert to good format
        let response: ScanResponse = JSON.parse(JSON.stringify(DemoData));
        // let response: ScanResponse = await documentApi.uploadImage(
        //   capturedPhoto.uri
        // );
        const document: Document = {
          id: documents.length.toString(),
          name: "Rechung von " + new Date().toLocaleDateString(),
          documemtImages: [capturedPhoto],
          scanResponse: response,
        };
        dispatch(addDocument(document));
        router.replace("/document");
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!permission) {
    return <View />;
  }

  if (showCamera && !capturedPhoto) {
    return (
      <CameraComponent
        onCapture={(uri) => {
          setCapturedPhoto(uri);
          setShowCamera(false);
        }}
      />
    );
  }

  return (
    <PreviewComponent
      photoUri={capturedPhoto!.uri}
      onRetake={() => {
        setCapturedPhoto(null);
        setShowCamera(true);
      }}
      onContinue={() => continueWithImage()}
    />
  );
}
