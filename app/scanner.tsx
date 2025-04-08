import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useCameraPermissions } from "expo-camera";
import CameraComponent from "../screens/Scanning/CameraComponent";
import PreviewComponent from "../screens/Scanning/PreviewComponent";
import { router } from "expo-router";
import { ApiResponse } from "~/models/ApiResponse";
import { documentApi } from "~/services/api";
import { persistScannedImage } from "~/services/file";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "@/db/schema";
import {
  InvoiceInsert,
  InvoicePositionsInsert,
  SummeriesInsert,
} from "@/db/schema";
import DeviceInfo from "react-native-device-info";
import { Platform } from "react-native";

export default function Scanner() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [showCamera, setShowCamera] = useState<boolean>(true);
  const [isSimulator, setIsSimulator] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!permission || !permission.granted) {
        await requestPermission();
      }
    })();

    (async () => {
      const isEmulator = await DeviceInfo.isEmulator();
      setIsSimulator(isEmulator && Platform.OS === "ios");
    })();
  }, []);

  useEffect(() => {
    if (isSimulator) {
      setCapturedPhotos([
        "https://blocks.astratic.com/img/general-img-square.png",
      ]);
    }
  }, [isSimulator]);

  const continueWithImages = async () => {
    if (capturedPhotos.length > 0) {
      try {
        // First navigate to document detail page - it will show loading skeleton
        const tempId = -1; // Temporary ID until real ID is known
        router.replace({
          pathname: "/document/[id]",
          params: { id: tempId },
        });

        let response: ApiResponse = await documentApi.analyseDocument(
          capturedPhotos[0]
        );
        const invoice = await persistInvoice(response);

        if (invoice.invoiceId !== -1) {
          router.replace({
            pathname: "/document/[id]",
            params: { id: invoice.invoiceId },
          });
        } else {
          console.error("Failed to persist invoice:", invoice);
          router.replace({
            pathname: "/document",
            params: { id: invoice.invoiceId },
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const persistInvoice = async (
    scanResponse: ApiResponse
  ): Promise<{
    invoiceId: number;
    invoiceName: string;
  }> => {
    return await drizzleDb.transaction(async (tx) => {
      const insertInvoice = {
        titel: scanResponse.overallSummary.titel,
        datum: scanResponse.overallSummary.datum,
        gesamtbetrag: scanResponse.overallSummary.gesamtbetrag,
        classification: scanResponse.classification.classification,
        language: scanResponse.classification.language,
      } satisfies InvoiceInsert;
      const [invoice] = await tx
        .insert(schema.invoice)
        .values(insertInvoice)
        .returning({
          invoiceId: schema.invoice.id,
          invoiceName: schema.invoice.titel,
        });

      await Promise.all(
        capturedPhotos.map(async (uri, index) => {
          return await persistScannedImage(
            uri,
            invoice.invoiceId,
            index,
            invoice.invoiceName
          );
        })
      );

      const procedureItems: InvoicePositionsInsert[] =
        scanResponse.original.map((item) => {
          return {
            anzahl: item.anzahl,
            betrag: item.betrag,
            datum: item.datum,
            titel: item.titel,
            tarifziffer: item.tarifziffer,
            tarif: item.tarif,
            beschreibung: item.beschreibung,
            interpretation: item.interpretation,
          };
        });

      const invoicePositions = await tx
        .insert(schema.invoicePositions)
        .values(procedureItems)
        .returning();

      const summeries: SummeriesInsert[] = scanResponse.summaries.map(
        (item) => {
          return {
            invoiceid: invoice.invoiceId,
            datum: item.datum,
            emoji: item.emoji,
            titel: item.titel,
            beschreibung: item.beschreibung,
            reasoning: item.reasoning,
            betrag: item.betrag,
          };
        }
      );

      summeries.forEach(async (summary, index) => {
        const [summery] = await tx
          .insert(schema.summeries)
          .values(summary)
          .returning({ id: schema.summeries.id });

        scanResponse.summaries[index].relevant_ids.forEach(async (id) => {
          await tx.insert(schema.summeriesToPositions).values({
            summeries_id: summery.id,
            invoicePositions_id: invoicePositions[id].id,
          });
        });
      });

      return invoice;
    });
  };

  if (!permission) {
    return <View />;
  }

  if (showCamera && capturedPhotos.length === 0 && !isSimulator) {
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
