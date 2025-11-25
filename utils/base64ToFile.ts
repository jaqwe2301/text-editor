/**
 * base64String을 File로 변환하는 함수
 * @param base64String - base64String
 * @param fileName - 파일 이름
 * @returns File
 */
export function base64ToFile(base64String: string, fileName: string): File {
  const reader = new FileReader();
  reader.onload = () => {
    // const imageUrl = reader.result as string;
  };
  try {
    const base64Data = base64String.split(",")[1];
    if (!base64Data) throw new Error("Invalid base64 string");

    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const mimeType =
      base64String.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*?,/)?.[1] ||
      "application/octet-stream";
    const blob = new Blob([bytes], { type: mimeType });

    return new File([blob], fileName, { type: mimeType });
  } catch (error) {
    throw new Error(`Failed to convert base64 to File: ${error}`);
  }
}
