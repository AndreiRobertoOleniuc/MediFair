import { CameraCapturedPicture } from "expo-camera";

export interface Document {
  id: string;
  title: string;
  documemtImages: CameraCapturedPicture[];
}
