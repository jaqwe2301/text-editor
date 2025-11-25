import { useRef } from "react";
import AddPhoto from "@/assets/add_photo_alternate.icon.svg";

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
      <AddPhoto className="fill-black w-6 desktop:w-10" />
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
