import { base64ToFile } from "@/utils/base64ToFile";
import { uploadToS3 } from "@/lib/aws/s3";
import { DataType } from "@/lib/aws/s3";
import { v4 as uuidv4 } from "uuid";

export async function blobUrlToBase64(blobUrl: string): Promise<string> {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          resolve(result); // ✅ base64 data:image/... 형태
        } else {
          reject(new Error("Failed to convert blob to base64 string"));
        }
      };

      reader.onerror = (err) => {
        reject(err);
      };

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    throw new Error(
      `Failed to convert blob URL to base64: ${(error as Error).message}`
    );
  }
}

export const createS3Url = async (
  imageUrl: string,
  dataType: DataType,
  id?: string
) => {
  const isStartHttps = imageUrl?.startsWith("https://");
  if (isStartHttps) {
    return imageUrl; // 이미 S3 URL인 경우 그대로 반환
  }
  const base64String = await blobUrlToBase64(imageUrl);
  const file = base64ToFile(base64String, id || uuidv4());
  return await uploadToS3(file, dataType);
};
