"use client";

import Image from "next/image";

import { Editor } from "@tiptap/core";

const alignments: {
  label: string;
  value: "left" | "right" | "center" | "justify";
  icon: React.ReactNode;
}[] = [
  {
    label: "양쪽 정렬",
    value: "justify",
    icon: (
      <Image
        src="/assets/format_align_justify.svg"
        alt="양쪽 정렬"
        className="w-6 desktop:w-8"
        width={32}
        height={32}
      />
    ),
  },
  {
    label: "왼쪽 정렬",
    value: "left",
    icon: (
      <Image
        src="/assets/format_align_left.svg"
        alt="왼쪽 정렬"
        className="w-6 desktop:w-8"
        width={32}
        height={32}
      />
    ),
  },
  {
    label: "가운데 정렬",
    value: "center",
    icon: (
      <Image
        src="/assets/format_align_center.svg"
        alt="가운데 정렬"
        className="w-6 desktop:w-8"
        width={32}
        height={32}
      />
    ),
  },
  {
    label: "오른쪽 정렬",
    value: "right",
    icon: (
      <Image
        src="/assets/format_align_right.svg"
        alt="오른쪽 정렬"
        className="w-6 desktop:w-8"
        width={32}
        height={32}
      />
    ),
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
