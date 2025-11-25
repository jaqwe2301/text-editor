// extensions/LimitLengthExtension.ts
import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, Transaction } from "prosemirror-state";

const MAX_LENGTH = 3000;

export const MaxLength = Extension.create({
  name: "limitLength",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("limitLength"),
        // 1. 모든 입력(타이핑/붙여넣기) 사전 필터링
        filterTransaction(tr: Transaction, state) {
          if (!tr.docChanged) return true; // 변화 없으면 통과
          const text = tr.doc.textContent || "";
          if (text.length > MAX_LENGTH) {
            // 너무 길면 막음
            alert("최대 입력 가능 글자 수를 초과했습니다.");
            return false;
          }
          return true;
        },
        // 2. 붙여넣기는 handlePaste로 UX 향상(경고 등)
        props: {
          handlePaste(view, event, slice) {
            const currentText = view.state.doc.textContent || "";
            const clipboardData = event.clipboardData;
            const pastedText = clipboardData
              ? clipboardData.getData("text/plain")
              : "";
            if (currentText.length + pastedText.length > MAX_LENGTH) {
              alert("최대 입력 가능 글자 수를 초과하여 붙여넣기가 제한됩니다.");
              return true; // 붙여넣기 막음
            }
            return false;
          },
        },
      }),
    ];
  },
});
