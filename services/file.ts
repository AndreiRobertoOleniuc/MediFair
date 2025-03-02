import * as FileSystem from "expo-file-system";

const SCANS_FOLDER = FileSystem.documentDirectory + "scans/";

//TODO: Store the scanned images with the documentid prefix so I can find it easier then
// Persist a scanned image into the scans folder
export const persistScannedImage = async (
  temporaryUri: string,
  documentId: number,
  imageIndex: number,
  documentName: string
): Promise<string> => {
  const fileName = `${documentName}-${documentId}-${imageIndex}.jpg`;
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
    return files.map((file) => SCANS_FOLDER + file);
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

export const findImageUri = (
  documentId: number,
  documentName: string,
  scans: string[]
): string[] => {
  const fileName = `${documentName}-${documentId}`;
  const foundScan = scans.filter((scan) => scan.includes(fileName));
  return foundScan.sort();
};
