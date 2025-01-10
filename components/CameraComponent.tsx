import React, { useRef } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { CameraCapturedPicture, CameraView } from "expo-camera";

interface CameraComponentProps {
  onCapture: (photoUri: CameraCapturedPicture) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const cameraRef = useRef<CameraView>(null);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        onCapture(photo);
      } else {
        console.error("Failed to take picture");
      }
    }
  };

  return (
    <View style={styles.cameraContainer}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        <View style={styles.gridContainer}>
          <View
            style={[styles.gridLine, styles.horizontalLine, { top: "33.33%" }]}
          />
          <View
            style={[styles.gridLine, styles.horizontalLine, { top: "66.66%" }]}
          />
          <View
            style={[styles.gridLine, styles.verticalLine, { left: "33.33%" }]}
          />
          <View
            style={[styles.gridLine, styles.verticalLine, { left: "66.66%" }]}
          />
        </View>
      </CameraView>
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
  },
  camera: {
    height: "85%",
    width: "100%",
  },
  bottomSection: {
    height: "15%",
    backgroundColor: "black",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    borderWidth: 5,
    borderColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 20,
  },
  gridContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  horizontalLine: {
    height: 1,
    width: "100%",
  },
  verticalLine: {
    width: 1,
    height: "100%",
  },
});

export default CameraComponent;
