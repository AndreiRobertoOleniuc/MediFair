import * as FileSystem from "expo-file-system";

const SCANS_FOLDER = FileSystem.documentDirectory + "scans/";

//TODO: Store the scanned images with the documentid prefix so I can find it easier then
// Persist a scanned image into the scans folder
export const persistScannedImage = async (
  temporaryUri: string,
  invoiceId: number,
  imageIndex: number,
  invoiceName: string
): Promise<string> => {
  const fileName = `${invoiceName}-${invoiceId}-${imageIndex}.jpg`;
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
  invoiceId: number,
  invoiceName: string,
  scans: string[]
): string[] => {
  const fileName = `${invoiceName}-${invoiceId}`;
  const foundScan = scans.filter((scan) => scan.includes(fileName));
  return foundScan.sort();
};

export const deleteScans = async (invoiceId: number, invoiceName: string) => {
  const fileName = `${invoiceName}-${invoiceId}`;
  const scans = (await loadScans()) ?? [];
  const scansToDelete = scans.filter((scan) => scan.includes(fileName));
  await Promise.all(
    scansToDelete.map((scan) =>
      FileSystem.deleteAsync(scan, { idempotent: true })
    )
  );
};
