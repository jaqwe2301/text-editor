import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";

export const BlockDropGuard = Extension.create({
  name: "blockDropGuard",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDrop: (view, event, slice, moved) => {
            const coords = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            if (!coords) return false;
            const { pos } = coords;

            const $pos = view.state.doc.resolve(pos);
            const beforeNode = $pos.nodeBefore;
            const afterNode = $pos.nodeAfter;

            // image가 linkPreview 바로 위에 올려질 때 방지!
            if (
              slice.content.firstChild?.type.name === "image" &&
              afterNode?.type?.name === "linkPreview"
            ) {
              event.preventDefault();
              return true;
            }
            // linkPreview 위에 image가 오지 않게 하고 싶다면 여기도 추가!
            if (
              slice.content.firstChild?.type.name === "linkPreview" &&
              beforeNode?.type?.name === "image"
            ) {
              event.preventDefault();
              return true;
            }

            return false;
          },
        },
      }),
    ];
  },
});
