"use client";

import { useState } from "react";
import Image from "next/image";

import ColorPicker from "./ColorPicker";
import VerticalBar from "@/components/Atoms/VerticalBar";

import { Editor } from "@tiptap/core";

export default function TextStyleToolbar({
  editor,
}: {
  editor: Editor | null;
}) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  if (!editor) return null;

  const textStyles: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  }[] = [
    {
      label: "굵게",
      icon: (
        <Image
          src="/assets/format_bold.svg"
          alt="굵게"
          className="w-6 desktop:w-8 transition-all hover:opacity-60 group-hover:scale-105"
          width={32}
          height={32}
        />
      ),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "이텔릭",
      icon: (
        <Image
          src="/assets/format_italic.svg"
          alt="이텔릭"
          className="w-6 desktop:w-8 transition-all hover:opacity-60 group-hover:scale-105"
          width={32}
          height={32}
        />
      ),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "밑줄",
      icon: (
        <Image
          src="/assets/format_underlined.svg"
          alt="밑줄"
          className="w-6 desktop:w-8 transition-all hover:opacity-60 group-hover:scale-105"
          width={32}
          height={32}
        />
      ),
      onClick: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: "취소선",
      icon: (
        <Image
          src="/assets/format_strikethrough.svg"
          alt="취소선"
          className="w-6 desktop:w-8 transition-all hover:opacity-60 group-hover:scale-105"
          width={32}
          height={32}
        />
      ),
      onClick: () => editor.chain().focus().toggleStrike().run(),
    },
  ];

  return (
    <>
      {textStyles.map(({ label, icon, onClick }) => (
        <button key={label} onClick={onClick}>
          {icon}
        </button>
      ))}
      <VerticalBar />
      <div className="cursor-pointer relative">
        <button onClick={() => setIsPickerOpen((prev) => !prev)}>
          <Image
            src="/assets/format_color_text.svg"
            alt="텍스트 색상"
            className="w-6 desktop:w-8"
            width={32}
            height={32}
          />
        </button>
        {isPickerOpen && (
          <ColorPicker
            selectedColor={editor.getAttributes("textStyle").color || "#000000"}
            onColorSelect={(color) =>
              editor.chain().focus().setColor(color).run()
            }
            onClose={() => setIsPickerOpen(false)}
          />
        )}
      </div>
    </>
  );
}
