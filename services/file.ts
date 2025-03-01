import * as FileSystem from "expo-file-system";

const SCANS_FOLDER = FileSystem.documentDirectory + "scans/";

// Persist a scanned image into the scans folder
export const persistScannedImage = async (
  temporaryUri: string
): Promise<string> => {
  const fileName = `scanned_${Date.now()}.jpg`;
  const destinationUri = SCANS_FOLDER + fileName;
  await ensureScansFolderExists();
  await FileSystem.moveAsync({
    from: temporaryUri,
    to: destinationUri,
  });
  return destinationUri;
};

// Load all scan files from the scans folder
export const loadScans = async () => {
  try {
    await ensureScansFolderExists();
    const files = await FileSystem.readDirectoryAsync(SCANS_FOLDER);
    return files;
  } catch (error) {
    console.error("Error loading scans:", error);
  }
};

// Ensure the scans folder exists
const ensureScansFolderExists = async () => {
  const folderInfo = await FileSystem.getInfoAsync(SCANS_FOLDER);
  if (!folderInfo.exists) {
    await FileSystem.makeDirectoryAsync(SCANS_FOLDER, {
      intermediates: true,
    });
  }
};
