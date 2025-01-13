import { CameraCapturedPicture } from "expo-camera";

export interface Document {
  id: string;
  documemtImages: CameraCapturedPicture[];
}
