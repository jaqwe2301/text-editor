"use client";

import AlignLeftIcon from "@/assets/format_align_left.icon.svg";
import AlignJustifyIcon from "@/assets/format_align_justify.icon.svg";
import AlignCenterIcon from "@/assets/format_align_center.icon.svg";
import AlignRightIcon from "@/assets/format_align_right.icon.svg";
import { Editor } from "@tiptap/core";

const alignments: {
  label: string;
  value: "left" | "right" | "center" | "justify";
  icon: React.ReactNode;
}[] = [
  {
    label: "양쪽 정렬",
    value: "justify",
    icon: <AlignJustifyIcon className="w-6 desktop:w-10" />,
  },
  {
    label: "왼쪽 정렬",
    value: "left",
    icon: <AlignLeftIcon className="w-6 desktop:w-10" />,
  },
  {
    label: "가운데 정렬",
    value: "center",
    icon: <AlignCenterIcon className="w-6 desktop:w-10" />,
  },
  {
    label: "오른쪽 정렬",
    value: "right",
    icon: <AlignRightIcon className="w-6 desktop:w-10" />,
  },
];

export default function AlignToolbar({ editor }: { editor: Editor | null }) {
  const handleAlignmentChange = (
    alignment: "left" | "right" | "center" | "justify"
  ) => {
    if (!editor) return;

    editor.chain().focus().setTextAlign(alignment).run();
  };

  return (
    <>
      {alignments.map(({ label, value, icon }) => (
        <button key={label} onClick={() => handleAlignmentChange(value)}>
          {icon}
        </button>
      ))}
    </>
  );
}
