"use client";

import { useState } from "react";

import ColorPicker from "./ColorPicker";
import VerticalBar from "@/components/Atoms/VerticalBar";

import BoldIcon from "@/assets/format_bold.icon.svg";
import ItalicIcon from "@/assets/format_italic.icon.svg";
import UnderlineIcon from "@/assets/format_underlined.icon.svg";
import StrikethroughIcon from "@/assets/format_strikethrough.icon.svg";
import ColorTextIcon from "@/assets/format_color_text.icon.svg";
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
      icon: <BoldIcon className="w-6 desktop:w-10" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "이텔릭",
      icon: <ItalicIcon className="w-6 desktop:w-10" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "밑줄",
      icon: <UnderlineIcon className="w-6 desktop:w-10" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: "취소선",
      icon: <StrikethroughIcon className="w-6 desktop:w-10" />,
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
          <ColorTextIcon className="w-6 desktop:w-10" />
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
