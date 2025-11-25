import { Mark, mergeAttributes, CommandProps } from "@tiptap/core";

const FONT_PREFIX = "font-";

// 기존 클래스에서 폰트 패밀리 관련 클래스만 모두 제거
function cleanFontClass(className: string) {
  if (!className) return "";
  return className
    .split(" ")
    .filter((c) => !c.startsWith(FONT_PREFIX))
    .join(" ");
}

export const FontFamilyClass = Mark.create({
  name: "fontFamilyClass",
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: (element) => element.getAttribute("class"),
        renderHTML: (attributes) => {
          if (!attributes.class) return {};
          return { class: attributes.class };
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: "span[class]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setFontFamilyClass:
        (className: string) =>
        ({ commands, editor }: CommandProps) => {
          const current = editor.getAttributes("fontFamilyClass").class || "";
          const nextClass = [cleanFontClass(current), className || ""]
            .filter(Boolean)
            .join(" ")
            .trim();
          return commands.setMark(this.name, { class: nextClass });
        },
    };
  },
});
