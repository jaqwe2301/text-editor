import { Mark, mergeAttributes, CommandProps } from "@tiptap/core";

const FONT_PREFIX = "font-";

export const FontFamilyClass = Mark.create({
  name: "fontFamilyClass",

  addAttributes() {
    return {
      fontFamilyClass: {
        default: null,

        // HTML -> ProseMirror 로 파싱할 때
        parseHTML: (element) => {
          const className = element.getAttribute("class") ?? "";
          const fontClass =
            className.split(" ").find((c) => c.startsWith(FONT_PREFIX)) ?? null;

          return fontClass;
        },

        // ProseMirror -> DOM 으로 렌더할 때
        renderHTML: (attributes) => {
          if (!attributes.fontFamilyClass) return {};
          return {
            class: attributes.fontFamilyClass,
          };
        },
      },
    };
  },

  // 어떤 DOM을 이 마크로 인식할지
  parseHTML() {
    return [{ tag: 'span[class*="font-"]' }];
  },

  // 마크가 DOM으로 나갈 때의 기본 형태
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      setFontFamilyClass:
        (className: string) =>
        ({ commands }: CommandProps) => {
          // 같은 값이면 굳이 다시 세팅 안 해도 되지만,
          // 여기서는 그냥 덮어쓰는 방식으로 간단하게.
          const next = className || null;

          return commands.setMark(this.name, {
            fontFamilyClass: next,
          });
        },
    };
  },
});
