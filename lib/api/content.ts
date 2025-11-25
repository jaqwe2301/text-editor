export interface TextContent {
  text: string; // 텍스트 내용
  tags: ("strong" | "em" | "u" | "s")[];
  styles: { fontSize?: string; fontFamily?: string; color?: string };
}

export interface ContentBlock {
  id: string; // 고유 ID
  type: "text" | "image" | "link"; // 콘텐츠 타입
  align?: "left" | "right" | "center" | "justify";
  content: TextContent[] | string;
  isMain?: boolean; // 대표 이미지 여부
  width?: string; // 이미지 너비
  height?: string; // 이미지 높이
}

export interface ContentRequest {
  content: ContentBlock[];
  isTop?: boolean;
  videoUrl?: string;
  hashTags?: string[];
}

export const contentApi = {
  createContent: async (content: ContentRequest) => {
    // const response = await apiClient.post<ContentResponse>(
    //   `api/~~~`,
    //   content
    // );
    return;
  },
};
