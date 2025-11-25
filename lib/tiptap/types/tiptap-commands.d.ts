import "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    /**
     * 폰트 크기 설정
     */
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
    };

    image: {
      /**
       * 이미지 노드 삽입
       */
      setImage: (attrs: {
        src: string;
        alt?: string | null;
        title?: string | null;
        width?: string | null;
        height?: string | null;
        id?: string | null;
        isMain?: boolean;
      }) => ReturnType;
    };

    fontFamilyClass: {
      /**
       * className 기반 폰트 패밀리 설정
       */
      setFontFamilyClass: (className: string) => ReturnType;
    };
  }
}
