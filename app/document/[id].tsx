import { useLocalSearchParams } from "expo-router";
import { View, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";

import { useAppSelector } from "@/store/hooks";
import {
  selectDocumentById,
  selectDocumentStatus,
} from "@/store/selectors/documentSelectors";

import ImageSlider from "~/screens/DetailScreen/ImageSlider";
import SummaryList from "~/screens/DetailScreen/SummaryList";
import { Text } from "@/components/nativewindui/Text";
import { Skeleton } from "~/components/custom/Skeleton";

export default function DocumentDetail() {
  const { id } = useLocalSearchParams();
  const document = useAppSelector(selectDocumentById(Number(id)));
  const status = useAppSelector(selectDocumentStatus);
  const [isFitMode, setIsFitMode] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Loading Logic
  const lastRequestDuration = 40000;
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
  if (status === "loading") {
    return (
      <SafeAreaView className="flex-1 bg-background">
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
      </SafeAreaView>
    );
  }

  if (!document || !document.scanResponse) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <Text className="text-foreground">Document not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { summaries } = document.scanResponse;
  let photoUri: string[] = document.imageUris;

  const handlePrev = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentImageIndex < photoUri.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View>
        <Text numberOfLines={2} className="text-xl font-bold text-left p-4">
          {document.name}
        </Text>
      </View>

      <ImageSlider
        images={photoUri}
        currentIndex={currentImageIndex}
        onPrev={handlePrev}
        onNext={handleNext}
        isFitMode={isFitMode}
        toggleFitMode={() => setIsFitMode(!isFitMode)}
      />
      {isFitMode && (
        <SummaryList
          summaries={summaries.map((summary, index) => ({
            ...summary,
            documentId: document.id,
            id: index.toString(),
          }))}
        />
      )}
    </SafeAreaView>
  );
}
