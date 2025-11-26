import { useRef } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  insertImage: (imageUrl: string) => void;
}

export default function ImageUploader({ insertImage }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        insertImage(reader.result.toString());
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <button onClick={() => fileInputRef.current?.click()}>
      <Image
        src="/assets/add_photo_alternate.svg"
        alt="add_photo"
        className="w-6 desktop:w-8 transition-all hover:opacity-60 group-hover:scale-105"
        width={32}
        height={32}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImageUpload}
      />
    </button>
  );
}
