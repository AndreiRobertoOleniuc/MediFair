import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useState, useEffect } from "react";

import ImageViewer from "~/screens/DetailScreen/ImageViewer";
import SummaryList from "~/screens/DetailScreen/SummaryList";
import { Text } from "@/components/nativewindui/Text";
import { Skeleton } from "~/components/custom/Skeleton";
import { SafeAreaViewComponent } from "~/components/custom/SafeAreaComponent";

//For Simulator
import DeviceInfo from "react-native-device-info";

//DB
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";

//Image Loading
import { loadScans, findImageUri } from "~/services/file";

export default function DocumentDetail() {
  const { id } = useLocalSearchParams();

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  const [scannedUri, setScannedUri] = useState<string[]>([]);

  const { data } = useLiveQuery(
    drizzleDb
      .select()
      .from(schema.summeries)
      .leftJoin(
        schema.invoice,
        eq(schema.summeries.invoiceid, schema.invoice.id)
      )
      .where(eq(schema.summeries.invoiceid, +id))
  );

  const [isFitMode, setIsFitMode] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchScans = async () => {
      const scans = await loadScans();
      if (
        scans &&
        scans?.length > 0 &&
        data.length > 0 &&
        data[0]?.invoice?.titel
      ) {
        const imageUri = findImageUri(+id, data[0]?.invoice?.titel, scans);
        setScannedUri(imageUri);
      }

      (await DeviceInfo.isEmulator()) &&
        setScannedUri([
          "https://blocks.astratic.com/img/general-img-square.png",
          "https://blocks.astratic.com/img/general-img-square.png",
          "https://blocks.astratic.com/img/general-img-square.png",
          "https://blocks.astratic.com/img/general-img-square.png",
        ]);
    };

    fetchScans();
  }, [data]);

  // Loading Logic
  const lastRequestDuration = 20000;
  const messages = [
    "⏳ Das Dokument wird geprüft",
    "💭 Wir suchen nach Mustern",
    "⏱️ Einen kurzen Moment bitte",
    "💨 Fast fertig",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) =>
        prev < messages.length - 1 ? prev + 1 : prev
      );
    }, lastRequestDuration / messages.length);
    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    const intervalMs = 100;
    const interval = setInterval(() => {
      setProgress((prev) =>
        Math.min(prev + (intervalMs / lastRequestDuration) * 100, 100)
      );
    }, intervalMs);
    return () => clearInterval(interval);
  }, []);

  // Dot animation
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotCount((prev) => (prev < 3 ? prev + 1 : 1));
    }, 500);
    return () => clearInterval(dotInterval);
  }, []);

  // Show loading skeleton with progressive messages
  if (id == "-1") {
    return (
      <SafeAreaViewComponent className="flex-1 bg-background">
        <View className="p-4">
          <View className="mb-6">
            <View className="mb-4">
              <Text className="text-foreground text-base">
                {messages[currentMessageIndex] + ".".repeat(dotCount)}
              </Text>
            </View>
            <View className="h-2 bg-gray-300 rounded">
              <View
                style={{ width: `${progress}%` }}
                className="h-full bg-primary rounded"
              />
            </View>
          </View>
          <Skeleton variant="text" className="w-3/4 h-8 mb-6" />
          <Skeleton className="w-full h-80 mb-4" />
          <View className="mt-6 space-y-4">
            <Skeleton className="w-full h-24 rounded-lg mb-2" />
            <Skeleton className="w-full h-24 rounded-lg mb-2" />
          </View>
        </View>
      </SafeAreaViewComponent>
    );
  }

  if (!data) {
    return (
      <SafeAreaViewComponent className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <Text className="text-foreground">Document not found</Text>
        </View>
      </SafeAreaViewComponent>
    );
  }

  const handlePrev = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentImageIndex < scannedUri.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <SafeAreaViewComponent className="flex-1 bg-background">
      <View className="flex-row justify-between items-center flex-wrap px-4 mb-2 mt-4">
        <Text className="text-xl font-bold text-left">
          {data[0]?.invoice?.titel || "Rechnung"}
        </Text>
        <Text className="text-base text-muted-foreground text-left">
          {data[0]?.invoice?.datum || "Beschreibung"}
        </Text>
      </View>

      <Text className="text-base text-muted-foreground text-left px-4 pb-4">
        Gesamtbetrag: {data[0]?.invoice?.gesamtbetrag}
      </Text>

      {scannedUri.length > 0 ? (
        <ImageViewer
          images={scannedUri}
          currentIndex={currentImageIndex}
          onPrev={handlePrev}
          onNext={handleNext}
          isFitMode={isFitMode}
          toggleFitMode={() => setIsFitMode(!isFitMode)}
        />
      ) : (
        <View className="justify-center p-4">
          <Text className="text-foreground">Keine Bilder gefunden</Text>
        </View>
      )}
      {isFitMode && (
        <SummaryList
          summaries={data.map((entry) => {
            return {
              ...entry.summeries,
              id: entry.summeries.id.toString(),
            };
          })}
        />
      )}
    </SafeAreaViewComponent>
  );
}
