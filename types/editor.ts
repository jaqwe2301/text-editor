export interface TextContent {
  text: string; // 텍스트 내용
  tags: ("strong" | "em" | "u" | "s")[];
  styles: { fontSize?: string; fontFamily?: string; color?: string };
}

export interface EditorContentBlock {
  id: string; // 고유 ID
  type: "text" | "image" | "link"; // 콘텐츠 타입
  align?: "left" | "right" | "center" | "justify";
  content: TextContent[] | string;
  isMain?: boolean; // 대표 이미지 여부
  width?: string; // 이미지 너비
  height?: string; // 이미지 높이
}

export type StyleDescriptor =
  | {
      type: "tag";
      tagName: "strong" | "em" | "u" | "s";
    }
  | {
      type: "inline";
      key: keyof Pick<CSSStyleDeclaration, "fontSize" | "color">;
      value: string;
    }
  | {
      type: "class";
      className: "font-pretendard" | "font-nanum-gothic" | "font-noto-sans-kr";
    };

export type FontFamily =
  | { label: "기본서체"; value: "font-pretendard" }
  | { label: "나눔고딕"; value: "font-nanum-gothic" }
  | { label: "노토산스"; value: "font-noto-sans-kr" };
