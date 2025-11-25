"use client";

import ImageUploader from "./ImageUploader";

export default function InsertToolbar({
  insertImage,
}: {
  insertImage: (imageUrl: string) => void;
}) {
  return <ImageUploader insertImage={insertImage} />;
}
