import { Node, mergeAttributes } from "@tiptap/core";

export const LinkPreview = Node.create({
  name: "linkPreview",
  group: "block",
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      url: { default: "" },
      title: { default: "" },
      description: { default: "" },
      image: { default: "" },
    };
  },
  parseHTML() {
    return [{ tag: "div[data-link-preview]" }];
  },
  renderHTML({ HTMLAttributes }) {
    // 좌측 이미지
    const previewImage = HTMLAttributes.image
      ? [
          "img",
          {
            src: HTMLAttributes.image,
            style:
              "width:62px;height:62px;object-fit:cover;border-radius:10px;flex-shrink:0;background:#f4f6fa;box-shadow:0 1px 6px 0 rgba(40,46,60,0.10);margin-right:14px;",
            alt: "",
          },
        ]
      : null;

    // 우측 컨텐츠 (타이틀, 설명, url)
    const contentChildren = [
      [
        "a",
        {
          href: HTMLAttributes.url,
          target: "_blank",
          rel: "noopener noreferrer",
          style:
            "font-weight:600;font-size:15px;color:#253053;text-decoration:none;margin-bottom:2px;line-height:1.32;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;word-break:break-all;",
        },
        HTMLAttributes.title || HTMLAttributes.url,
      ],
      [
        "div",
        {
          style:
            "font-size:13px;color:#788095;line-height:1.42;overflow:hidden;white-space:pre-line;text-overflow:ellipsis;max-height:2.8em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;",
        },
        HTMLAttributes.description || "",
      ],
      [
        "span",
        {
          style:
            "font-size:12px;color:#b0b8c1;margin-top:2px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;",
        },
        HTMLAttributes.url,
      ],
    ];

    // 박스 전체 children은 [img, contentBox]
    const children = [
      previewImage,
      [
        "div",
        {
          style:
            "display:flex;flex-direction:column;min-width:0;flex:1;gap:6px;",
        },
        ...contentChildren,
      ],
    ].filter(Boolean); // img가 없을 때 null 제거!

    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-link-preview": "true",
        draggable: "false",
        style:
          "border:1.5px solid #e0e7ef;border-radius:16px;box-shadow:0 3px 12px 0 rgba(40,46,60,0.08);padding:14px 16px;margin:18px 0;display:flex;gap:12px;align-items:center;min-width:0;max-width:420px;background:#fff;",
      }),
      ...children, // 반드시 children spread!
    ];
  },
  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement("div");
      dom.setAttribute("data-link-preview", "true");
      dom.style.position = "relative";
      dom.style.cursor = "pointer";
      dom.style.border = "1.5px solid #e0e7ef";
      dom.style.borderRadius = "16px";
      dom.style.boxShadow = "0 3px 12px 0 rgba(40,46,60,0.08)";
      dom.style.padding = "14px 16px";
      dom.style.margin = "18px 0";
      dom.style.display = "flex";
      dom.style.gap = "12px";
      dom.style.alignItems = "center";
      dom.style.minWidth = "0";
      dom.style.maxWidth = "420px";
      dom.style.background = "#fff";

      // 이미지 (있을 때만)
      if (node.attrs.image) {
        const img = document.createElement("img");
        img.src = node.attrs.image;
        img.alt = "";
        img.style.width = "62px";
        img.style.height = "62px";
        img.style.objectFit = "cover";
        img.style.borderRadius = "10px";
        img.style.flexShrink = "0";
        img.style.background = "#f4f6fa";
        img.style.boxShadow = "0 1px 6px 0 rgba(40,46,60,0.10)";
        img.style.marginRight = "14px";
        dom.appendChild(img);
      }

      // 오른쪽(컨텐츠)
      const contentBox = document.createElement("div");
      contentBox.style.display = "flex";
      contentBox.style.flexDirection = "column";
      contentBox.style.minWidth = "0";
      contentBox.style.flex = "1";
      contentBox.style.gap = "6px";

      // 타이틀
      const a = document.createElement("a");
      a.href = node.attrs.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.style.fontWeight = "600";
      a.style.fontSize = "15px";
      a.style.color = "#253053";
      a.style.textDecoration = "none";
      a.style.marginBottom = "2px";
      a.style.lineHeight = "1.32";
      a.style.display = "-webkit-box";
      a.style.webkitLineClamp = "1";
      a.style.webkitBoxOrient = "vertical";
      a.style.overflow = "hidden";
      a.style.textOverflow = "ellipsis";
      a.style.wordBreak = "break-all";
      a.textContent = node.attrs.title || node.attrs.url;

      a.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(node.attrs.url, "_blank", "noopener,noreferrer");
      });

      // 설명
      const desc = document.createElement("div");
      desc.style.fontSize = "13px";
      desc.style.color = "#788095";
      desc.style.lineHeight = "1.42";
      desc.style.overflow = "hidden";
      desc.style.whiteSpace = "pre-line";
      desc.style.textOverflow = "ellipsis";
      desc.style.maxHeight = "2.8em";
      desc.style.display = "-webkit-box";
      desc.style.webkitLineClamp = "2";
      desc.style.webkitBoxOrient = "vertical";
      desc.textContent = node.attrs.description || "";

      // URL
      const url = document.createElement("span");
      url.style.fontSize = "12px";
      url.style.color = "#b0b8c1";
      url.style.marginTop = "2px";
      url.style.display = "block";
      url.style.overflow = "hidden";
      url.style.textOverflow = "ellipsis";
      url.style.whiteSpace = "nowrap";
      url.textContent = node.attrs.url;

      contentBox.appendChild(a);
      contentBox.appendChild(desc);
      contentBox.appendChild(url);

      dom.appendChild(contentBox);

      dom.addEventListener("click", () => {
        // 이미지를 클릭해도 이동, 내부 링크 중복 클릭도 방지
        window.open(node.attrs.url, "_blank", "noopener,noreferrer");
      });

      const closeBtn = document.createElement("button");
      closeBtn.innerText = "✕";
      closeBtn.style.position = "absolute";
      closeBtn.style.top = "8px";
      closeBtn.style.right = "8px";
      closeBtn.style.width = "24px";
      closeBtn.style.height = "24px";
      closeBtn.style.border = "none";
      closeBtn.style.borderRadius = "50%";
      closeBtn.style.background = "#f4f6fa";
      closeBtn.style.color = "#b0b8c1";
      closeBtn.style.fontSize = "18px";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.display = "none";
      closeBtn.style.zIndex = "10";
      closeBtn.style.transition = "background 0.15s";
      closeBtn.onmouseenter = () => {
        closeBtn.style.background = "#e2e6f0";
      };
      closeBtn.onmouseleave = () => {
        closeBtn.style.background = "#f4f6fa";
      };

      // 2. X 버튼 클릭 시 노드 삭제
      closeBtn.onclick = (e) => {
        e.stopPropagation();
        const pos = getPos?.();
        if (typeof pos === "number") {
          editor
            .chain()
            .focus()
            .deleteRange({ from: pos, to: pos + node.nodeSize })
            .run();
        }
      };

      dom.appendChild(closeBtn);

      // 드래그 방지
      // dom.addEventListener("dragstart", (e) => e.preventDefault());
      // dom.addEventListener("drop", (e) => e.preventDefault());

      return { dom };
    };
  },
});
