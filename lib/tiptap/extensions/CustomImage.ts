import { v4 as uuidv4 } from "uuid";
import { Node, mergeAttributes } from "@tiptap/core";
import { Node as ProseMirrorNode } from "prosemirror-model";

export const CustomImage = Node.create({
  name: "image",
  group: "block",
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: {
        default: null,
        parseHTML: (element) => element.getAttribute("width"),
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: (element) => element.getAttribute("height"),
        renderHTML: (attributes) => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        },
      },
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-id"),
        renderHTML: (attributes) => {
          if (!attributes.id) return {};
          return { "data-id": attributes.id };
        },
      },
      isMain: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-is-main") === "true",
        renderHTML: (attributes) =>
          attributes.isMain ? { "data-is-main": "true" } : {},
      },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      let selected = false;

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      img.title = node.attrs.title || "";
      img.style.display = "inline-block";
      img.style.verticalAlign = "middle";
      img.style.maxWidth = "100%";
      img.style.maxHeight = "480px";
      if (node.attrs.width) img.style.width = node.attrs.width;
      if (node.attrs.height) img.style.height = node.attrs.height;

      // 바깥 컨테이너: flex로 이미지 always center
      const container = document.createElement("div");
      const id = node.attrs.id || uuidv4();

      if (!node.attrs.id) {
        const pos = getPos?.();
        if (typeof pos === "number") {
          editor.commands.command(({ tr }) => {
            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              id,
              //   isMain: node.attrs.isMain,
            });
            return true;
          });
        }
      }

      container.dataset.id = id;
      container.style.position = "relative";
      container.style.width = "100%";
      container.style.display = "flex";
      container.style.justifyContent = "center";
      container.style.alignItems = "center";
      container.style.margin = "12px 0";
      container.style.padding = "4px";
      container.contentEditable = "false";
      container.draggable = true;

      // 이미지+핸들용 wrapper
      const wrapper = document.createElement("div");
      wrapper.style.display = "inline-block";
      wrapper.style.position = "relative";
      wrapper.style.lineHeight = "0";
      wrapper.appendChild(img);

      // 리사이즈 핸들 4개 추가
      const handlePositions = [
        {
          name: "top-left",
          style: { left: "-8px", top: "-8px", cursor: "nwse-resize" },
        },
        {
          name: "top-right",
          style: { right: "-8px", top: "-8px", cursor: "nesw-resize" },
        },
        {
          name: "bottom-left",
          style: { left: "-8px", bottom: "-8px", cursor: "nesw-resize" },
        },
        {
          name: "bottom-right",
          style: { right: "-8px", bottom: "-8px", cursor: "nwse-resize" },
        },
      ];

      const handles: HTMLDivElement[] = [];
      handlePositions.forEach((handlePos) => {
        const handle = document.createElement("div");
        Object.assign(handle.style, {
          width: "12px",
          height: "12px",
          background: "#2196f3",
          position: "absolute",
          borderRadius: "50%",
          zIndex: "2",
          border: "2px solid #fff",
          boxShadow: "0 0 2px #0001",
          ...handlePos.style,
        });

        handle.style.cursor = handlePos.style.cursor;

        let startX = 0,
          startY = 0,
          startWidth = 0,
          startHeight = 0,
          aspect = 1;

        handle.addEventListener("mousedown", (event: MouseEvent) => {
          event.preventDefault();
          event.stopPropagation();

          startX = event.clientX;
          startY = event.clientY;
          startWidth = img.offsetWidth;
          startHeight = img.offsetHeight;
          aspect = startWidth / startHeight;

          const onMouseMove = (moveEvent: MouseEvent) => {
            let diffX = moveEvent.clientX - startX;
            let diffY = moveEvent.clientY - startY;
            if (handlePos.name === "top-left") {
              diffX = -diffX;
              diffY = -diffY;
            } else if (handlePos.name === "top-right") {
              diffY = -diffY;
            } else if (handlePos.name === "bottom-left") {
              diffX = -diffX;
            }
            // 비율 유지
            let newWidth = Math.max(32, startWidth + diffX);
            let newHeight = Math.max(32, newWidth / aspect);
            img.style.width = `${newWidth}px`;
            img.style.height = `${newHeight}px`;
          };

          const onMouseUp = (_: MouseEvent) => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);

            const pos = getPos?.();
            if (typeof pos !== "number") return;
            const widthValue = img.style.width;
            const heightValue = img.style.height;

            const nodeInDoc = editor.state.doc.nodeAt(pos);
            if (!nodeInDoc) return;

            editor.commands.command(({ tr }) => {
              tr.setNodeMarkup(pos, undefined, {
                ...nodeInDoc.attrs,
                width: widthValue,
                height: heightValue,
                // isMain: node.attrs.isMain,
              });
              return true;
            });
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        });

        handles.push(handle);
        wrapper.appendChild(handle);
      });

      // 대표 이미지 버튼
      const mainButton = document.createElement("button");
      mainButton.innerText = "대표";
      mainButton.style.position = "absolute";
      mainButton.style.left = "12px";
      mainButton.style.top = "12px";
      mainButton.style.zIndex = "10";
      mainButton.style.height = "60px";
      mainButton.style.width = "104px";
      mainButton.style.fontSize = "24px";
      mainButton.style.borderRadius = "38px";
      mainButton.style.backgroundColor = "#c1c1c1";
      mainButton.style.display = "flex";
      mainButton.style.justifyContent = "center";
      mainButton.style.alignItems = "center";
      mainButton.style.display = "none";

      mainButton.addEventListener("click", (e) => {
        e.stopPropagation();

        const tr = editor.state.tr;

        // 1. 현재 문서의 모든 이미지 NodeView DOM을 매칭
        const allImageDivs = document.querySelectorAll(
          '[data-image-wrapper="true"]'
        );

        let imageIndex = 0;
        editor.state.doc.descendants((node, pos) => {
          if (node.type.name === "paragraph") {
            if (!node.attrs.id) {
              // id가 없으면 setNodeMarkup으로 id 부여
              editor.commands.command(({ tr }) => {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  id: uuidv4(),
                });
                return true;
              });
            }
          }
          if (node.type.name === "image") {
            // NodeView DOM에서 img 요소의 최신 width/height 추출
            const imageDiv = allImageDivs[imageIndex++];
            const imgElem = imageDiv?.querySelector("img");
            const latestWidth = imgElem?.style.width || node.attrs.width;
            const latestHeight = imgElem?.style.height || node.attrs.height;

            // 대표 이미지 여부: 클릭한 이미지인지 아닌지
            const isMain = (node.attrs.id || id) === id;

            tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              isMain,
              width: latestWidth,
              height: latestHeight,
            });
          }
        });

        editor.view.dispatch(tr);
      });

      const isMobile = window.innerWidth < 800; // 예시, 더 정교하게 감지 가능

      const upButton = document.createElement("button");
      const downButton = document.createElement("button");

      if (isMobile) {
        // 위로 이동 버튼
        upButton.innerText = "▲";
        upButton.innerText = "▲";
        upButton.style.position = "absolute";
        upButton.style.right = "20px";
        upButton.style.top = "8px";
        upButton.style.zIndex = "11";
        upButton.style.width = "32px";
        upButton.style.height = "32px";
        upButton.style.borderRadius = "100px";
        upButton.style.background = "#f2f4f6";
        upButton.style.border = "none";
        upButton.style.fontSize = "18px";
        upButton.style.opacity = "0.75";

        upButton.addEventListener("click", (e) => {
          e.stopPropagation();
          const pos = getPos?.();
          if (typeof pos !== "number") return;

          const { state, view } = editor;
          const currNode = state.doc.nodeAt(pos);
          if (!currNode) return;

          // 1. 위로 이동할 위치 찾기 (linkPreview면 스킵)
          let beforePos: number | null = null;
          let beforeNode: ProseMirrorNode | null = null;

          // 직전 노드 탐색 (linkPreview는 건너뜀)
          state.doc.forEach((node: ProseMirrorNode, nodeOffset: number) => {
            if (nodeOffset < pos) {
              if (node.type.name !== "linkPreview") {
                beforePos = nodeOffset;
                beforeNode = node;
              }
            }
          });

          // 만약 beforeNode가 없다면 이동 불가
          if (beforePos === null || !beforeNode) return;

          let tr = state.tr;
          // swap 로직 (큰 pos부터 삭제!)
          tr = tr.delete(pos, pos + currNode.nodeSize);
          tr = tr.delete(
            beforePos,
            beforePos + (beforeNode as ProseMirrorNode).nodeSize
          );
          tr = tr.insert(beforePos, currNode.copy(currNode.content));
          tr = tr.insert(
            beforePos + currNode.nodeSize,
            (beforeNode as ProseMirrorNode).copy(
              (beforeNode as ProseMirrorNode).content
            )
          );

          view.dispatch(tr);
          view.focus();
        });

        // 아래로 이동 버튼
        downButton.innerText = "▼";
        downButton.style.position = "absolute";
        downButton.style.right = "20px";
        downButton.style.top = "50px";
        downButton.style.zIndex = "11";
        downButton.style.width = "32px";
        downButton.style.height = "32px";
        downButton.style.borderRadius = "100px";
        downButton.style.background = "#f2f4f6";
        downButton.style.border = "none";
        downButton.style.fontSize = "18px";
        downButton.style.opacity = "0.75";

        downButton.addEventListener("click", (e) => {
          e.stopPropagation();
          const pos = getPos?.();
          if (typeof pos !== "number") return;

          const { state, view } = editor;
          const currNode = state.doc.nodeAt(pos);
          if (!currNode) return;

          // 1. 아래로 이동할 위치 찾기 (linkPreview면 스킵)
          let afterPos: number | null = null;
          let afterNode: ProseMirrorNode | null = null;
          let found = false;

          state.doc.forEach((node, nodeOffset) => {
            if (nodeOffset === pos) {
              found = true;
              return;
            }
            if (
              found &&
              afterNode == null &&
              node.type.name !== "linkPreview"
            ) {
              afterPos = nodeOffset;
              afterNode = node;
            }
          });

          if (afterPos === null || !afterNode) return;

          let tr = state.tr;
          tr = tr.delete(
            afterPos,
            afterPos + (afterNode as ProseMirrorNode).nodeSize
          ); // 아래 노드 먼저 삭제
          tr = tr.delete(pos, pos + currNode.nodeSize); // 자기 자신 삭제
          tr = tr.insert(
            pos,
            (afterNode as ProseMirrorNode).copy(
              (afterNode as ProseMirrorNode).content
            )
          ); // 아래 노드 먼저 삽입
          tr = tr.insert(
            pos + (afterNode as ProseMirrorNode).nodeSize,
            (currNode as ProseMirrorNode).copy(
              (currNode as ProseMirrorNode).content
            )
          ); // 자기 자신 그 뒤 삽입

          view.dispatch(tr);
          view.focus();
        });

        wrapper.appendChild(upButton);
        wrapper.appendChild(downButton);
      }

      // 선택 상태 업데이트 함수
      function updateSelectedState(isSelected: boolean) {
        selected = isSelected;
        // 핸들 보여주기/숨기기
        handles.forEach((handle) => {
          handle.style.display = selected ? "block" : "none";
        });
        wrapper.style.border = selected
          ? "2px solid #2196f3"
          : "2px solid transparent";
        mainButton.style.display = selected ? "flex" : "none";

        upButton.style.display = selected ? "block" : "none";
        downButton.style.display = selected ? "block" : "none";
      }

      wrapper.addEventListener("mouseenter", () => {
        mainButton.style.display = "flex";
      });
      wrapper.addEventListener("mouseleave", () => {
        // 선택되어 있지 않으면 감춤 (focus 유지면 그대로 show)
        if (!selected) mainButton.style.display = "none";
      });

      // 최초에는 비선택
      updateSelectedState(false);

      // wrapper 클릭 시: 자기 자신만 선택, 나머지는 비선택
      wrapper.addEventListener("click", (e) => {
        e.stopPropagation();
        // 모든 이미지 노드의 선택 해제
        document
          .querySelectorAll('[data-image-wrapper="true"]')
          .forEach((el) => {
            (el as HTMLElement).style.border = "2px solid transparent";
            Array.from(el.children).forEach((child) => {
              if (
                child instanceof HTMLElement &&
                child.dataset.handle === "true"
              ) {
                child.style.display = "none";
              }
            });
          });
        // 본인만 선택 표시
        updateSelectedState(true);
      });

      // 핸들, wrapper에 data-* 속성 지정(전역 해제용)
      wrapper.dataset.imageWrapper = "true";
      handles.forEach((handle) => (handle.dataset.handle = "true"));

      // 에디터 바깥 클릭 시 선택 해제
      document.addEventListener("click", (e) => {
        // 클릭이 wrapper 내부가 아니면 비선택

        const target = e.target as HTMLElement | null;
        if (!target || !wrapper.contains(target)) {
          updateSelectedState(false);
        }
      });

      wrapper.appendChild(mainButton);

      // wrapper를 container 중앙에 배치
      container.appendChild(wrapper);

      if (node.attrs.isMain) {
        mainButton.style.color = "white";
        mainButton.style.backgroundColor = "#0f7dff";
        mainButton.style.border = "2px solid #0f7dff";
      } else {
        mainButton.style.color = "black";
        mainButton.style.backgroundColor = "#c1c1c1";
        mainButton.style.border = "2px solid #c1c1c1";
      }

      return {
        dom: container,
        contentDOM: null,

        update: (updatedNode) => {
          if (updatedNode.attrs.src !== img.src) {
            img.src = updatedNode.attrs.src;
          }
          if (updatedNode.attrs.width)
            img.style.width = updatedNode.attrs.width;
          else img.style.width = "";
          if (updatedNode.attrs.height)
            img.style.height = updatedNode.attrs.height;
          else img.style.height = "";
          container.dataset.id = updatedNode.attrs.id || id;

          if (updatedNode.attrs.isMain) {
            // 대표일 때 버튼 스타일
            mainButton.style.color = "white";
            mainButton.style.backgroundColor = "#0f7dff";
            mainButton.style.border = "2px solid #0f7dff";
          } else {
            // 비대표일 때 버튼 스타일
            mainButton.style.color = "black";
            mainButton.style.backgroundColor = "#c1c1c1";
            mainButton.style.border = "2px solid #c1c1c1";
          }
          return true;
        },

        destroy() {
          document.removeEventListener("click", () => {});
        },
      };
    };
  },

  addCommands() {
    return {
      setImage:
        (attrs) =>
        ({ chain }) =>
          chain()
            .insertContent({
              type: this.name,
              attrs,
            })
            .run(),
    };
  },
});
