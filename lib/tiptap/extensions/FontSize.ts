import { Mark, mergeAttributes } from "@tiptap/core";

/**
 * 폰트 크기 커스텀 Extension
 * 폰트 크기 설정 기능을 추가하기 위해 꼭 필요!
 */
export const FontSize = Mark.create({
  name: "fontSize",
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
  parseHTML() {
    return [{ style: "font-size" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) =>
          chain().setMark(this.name, { fontSize: size }).run(),
    };
  },
});
