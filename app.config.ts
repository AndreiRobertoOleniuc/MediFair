import { ExpoConfig, ConfigContext } from "@expo/config";
import { version } from "./package.json";

// Replace these with your EAS project ID and project slug.
// You can find them at https://expo.dev/accounts/[account]/projects/[project].
const EAS_PROJECT_ID = "9cd5ad7d-bc74-4154-a6ac-8aa1c37bb9f1";
const PROJECT_SLUG = "tarmed-validation-tool";
const OWNER = "andreirobertooleniuc";

// App production config
const APP_NAME = "Medifair";
const BUNDLE_IDENTIFIER = "com.andreirobertooleniuc.medifair";
const PACKAGE_NAME = "com.andreirobertooleniuc.medifair";
const ICON = "./assets/images/icon.png";
const ADAPTIVE_ICON = "./assets/images/adaptive-icon.png";
const SCHEME = "medifair";

export default ({ config }: ConfigContext): ExpoConfig => {
  console.log("⚙️ Building app for environment:", process.env.APP_ENV);
  const { name, bundleIdentifier, icon, adaptiveIcon, packageName, scheme } =
    getDynamicAppConfig(
      (process.env.APP_ENV as "development" | "preview" | "production") ||
        "development"
    );

  return {
    ...config,
    name: name, // Automatically bump your project version with `npm version patch`, `npm version minor` or `npm version major`.
    slug: PROJECT_SLUG, // Must be consistent across all environments.
    version,
    orientation: "portrait",
    icon: icon,
    scheme: scheme,
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: false,
      bundleIdentifier: bundleIdentifier,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: adaptiveIcon,
        backgroundColor: "#ffffff",
      },
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
      ],
      package: packageName,
    },
    updates: {
      url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-camera",
        {
          cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
          microphonePermission:
            "Allow $(PRODUCT_NAME) to access your microphone",
          recordAudioAndroid: true,
        },
      ],
      [
        "react-native-document-scanner-plugin",
        {
          cameraPermission: "We need camera access so you can scan documents",
        },
      ],
      "expo-sqlite",
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "9cd5ad7d-bc74-4154-a6ac-8aa1c37bb9f1",
      },
    },
    owner: OWNER,
  };
};

// Dynamically configure the app based on the environment.
// Update these placeholders with your actual values.
export const getDynamicAppConfig = (
  environment: "development" | "preview" | "production"
) => {
  if (environment === "production") {
    return {
      name: APP_NAME,
      bundleIdentifier: BUNDLE_IDENTIFIER,
      packageName: PACKAGE_NAME,
      icon: ICON,
      adaptiveIcon: ADAPTIVE_ICON,
      scheme: SCHEME,
    };
  }

  if (environment === "preview") {
    return {
      name: `${APP_NAME} P.`,
      bundleIdentifier: `${BUNDLE_IDENTIFIER}.preview`,
      packageName: `${PACKAGE_NAME}.preview`,
      icon: "./assets/images/icon-dev.png",
      adaptiveIcon: "./assets/images/adaptive-icon-dev.png",
      scheme: `${SCHEME}-prev`,
    };
  }

  return {
    name: `${APP_NAME} D.`,
    bundleIdentifier: `${BUNDLE_IDENTIFIER}.dev`,
    packageName: `${PACKAGE_NAME}.dev`,
    icon: "./assets/images/icon-dev.png",
    adaptiveIcon: "./assets/images/adaptive-icon-dev.png",
    scheme: `${SCHEME}-dev`,
  };
};
