import {
  CameraView,
  useCameraPermissions,
  CameraCapturedPicture,
} from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] =
    useState<CameraCapturedPicture | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        setCapturedPhoto(photo);
      } else {
        console.error("Failed to take picture");
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (!permission || !permission.granted) {
        await requestPermission();
      }
    })();
  }, []);

  // Keep existing permission checks and UI
  if (!permission) {
    return <View />;
  }

  // Permission is granted here, show CTA if user hasn't opened camera yet
  if (!showCamera && !capturedPhoto) {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => setShowCamera(true)}
          title="Scan Tarmed Document"
        />
      </View>
    );
  }

  // Once camera is open and no photo is taken, let user take picture
  if (showCamera && !capturedPhoto) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={"back"} ref={cameraRef}>
          <View style={styles.gridContainer}>
            <View
              style={[
                styles.gridLine,
                styles.horizontalLine,
                { top: "33.33%" },
              ]}
            />
            <View
              style={[
                styles.gridLine,
                styles.horizontalLine,
                { top: "66.66%" },
              ]}
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
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
          ></TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.previewContainer}>
      <Image
        source={{ uri: capturedPhoto?.uri }}
        style={{
          width: 300,
          height: 400,
          resizeMode: "contain",
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#ECECEC",
        }}
      />
      <TouchableOpacity
        onPress={() => {
          setCapturedPhoto(null);
          setShowCamera(true);
        }}
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        <Text>Retake Picture</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log("Continue with Picture")}>
        <Text>Continue with Picture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F0F0F0",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
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
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
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
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
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
