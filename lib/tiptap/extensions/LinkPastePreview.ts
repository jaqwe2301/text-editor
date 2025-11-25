import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
// import { metadataApi } from "@/lib/api/endpoints/metadata";

export const LinkPastePreview = Extension.create({
  name: "linkPastePreview",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handlePaste(view, event) {
            if (!event.clipboardData) return false;

            const text = event.clipboardData.getData("text/plain").trim();
            const urlPattern = /^(https?:\/\/[^\s]+)/;

            if (urlPattern.test(text)) {
              // 붙여넣기 차단 (return true)
              event.preventDefault();

              // 비동기 처리는 setTimeout으로 안전하게 분리
              setTimeout(async () => {
                const url = text.match(urlPattern)?.[0];
                if (!url) return;
                // const metadata = await metadataApi.getSimpleMetadata(url);

                // 노드 생성 및 삽입
                const { state, dispatch } = view;
                const node = state.schema.nodes.linkPreview.create({
                  // ...(metadata || {}),
                });
                const tr = state.tr.replaceSelectionWith(node).scrollIntoView();
                dispatch(tr);
              }, 0);
            }
            return false; // 그 외 붙여넣기는 기본 동작
          },
        },
      }),
    ];
  },
});
