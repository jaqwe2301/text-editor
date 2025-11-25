"use client";

// import { metadataApi } from "@/lib/api/endpoints/metadata";
import { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Editor } from "@tiptap/core";
import { TextSelection, NodeSelection } from "prosemirror-state";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";

// 커스텀
import { FontSize } from "@/lib/tiptap/extensions/FontSize";
import { MaxLength } from "@/lib/tiptap/extensions/MaxLength";
import { CustomImage } from "@/lib/tiptap/extensions/CustomImage";
import { LinkPreview } from "@/lib/tiptap/extensions/LinkPreview";
import { BlockDropGuard } from "@/lib/tiptap/extensions/BlockDropGuard";
import { FontFamilyClass } from "@/lib/tiptap/extensions/FontFamilyClass";
import { LinkPastePreview } from "@/lib/tiptap/extensions/LinkPastePreview";

import ToolBar from "../Organisms/ToolBar";
import { useRouter } from "next/navigation";
import VideoUploader from "../Organisms/VideoUploader";
import HashtagEditor from "../Organisms/HashTag";

import { openModal } from "@/redux/slices/modalSlice";
import { base64ToFile } from "@/utils/base64ToFile";
import { v4 as uuidv4 } from "uuid";
// import { createS3Url } from "@/utils/createS3Url";
import { EditorContentBlock, TextContent } from "@/types/editor";
import { ContentRequest, contentApi } from "@/lib/api/content";

export default function EditorTemplate() {
  // const router = useRouter();
  // const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [hashtags, setHashtags] = useState<string[]>([]);

  // const editorContentToDocJSON = async (content: EditorContentBlock[]) => {
  //   const nodes = [];

  //   for (const block of content) {
  //     if (block.type === "text") {
  //       const textNodes = (block.content as TextContent[]).filter(
  //         (item) => item.text !== ""
  //       );
  //       // 빈 텍스트만 있을 경우 hard_break로 대체
  //       let nodeContent: any[] | undefined;
  //       if (
  //         (block.content as TextContent[]).length > 0 &&
  //         textNodes.length === 0
  //       ) {
  //         nodeContent = [{ type: "hardBreak" }];
  //       } else if (textNodes.length > 0) {
  //         nodeContent = textNodes.map((item) => {
  //           const marks: any[] = [];
  //           if (item.tags?.includes("strong")) marks.push({ type: "bold" });
  //           if (item.tags?.includes("em")) marks.push({ type: "italic" });
  //           if (item.tags?.includes("u")) marks.push({ type: "underline" });
  //           if (item.tags?.includes("s")) marks.push({ type: "strike" });
  //           if (
  //             item.styles &&
  //             (item.styles.fontSize ||
  //               item.styles.fontFamily ||
  //               item.styles.color)
  //           ) {
  //             marks.push({
  //               type: "textStyle",
  //               attrs: {
  //                 fontSize: item.styles.fontSize,
  //                 fontFamily: item.styles.fontFamily,
  //                 color: item.styles.color,
  //               },
  //             });
  //           }
  //           return {
  //             type: "text",
  //             text: item.text,
  //             marks: marks.length > 0 ? marks : undefined,
  //           };
  //         });
  //       }

  //       nodes.push({
  //         type: "paragraph",
  //         attrs: {
  //           textAlign: block.align || "left",
  //         },
  //         ...(nodeContent ? { content: nodeContent } : {}),
  //       });
  //     }

  //     if (block.type === "image") {
  //       nodes.push({
  //         type: "image",
  //         attrs: {
  //           src: block.content as string,
  //           id: block.id,
  //           isMain: !!block.isMain,
  //           width: block.width,
  //           height: block.height,
  //         },
  //       });
  //     }

  //     //   if (block.type === "link" && typeof block.content === "string") {
  //     //     const metadata = await metadataApi.getSimpleMetadata(
  //     //       block.content as string
  //     //     );
  //     //     const id = block.id || uuidv4();
  //     //     nodes.push({
  //     //       type: "linkPreview",
  //     //       attrs: {
  //     //         ...metadata,
  //     //         id,
  //     //       },
  //     //     });
  //     //   }
  //   }

  //   // ProseMirror 문서 구조
  //   return {
  //     type: "doc",
  //     content: nodes,
  //   };
  // };

  const editor = useEditor({
    extensions: [
      Color,
      FontSize,
      TextStyle,
      Underline,
      MaxLength,
      StarterKit,
      LinkPreview,
      CustomImage,
      BlockDropGuard,
      FontFamilyClass,
      LinkPastePreview,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: `<p style="height: 100%;">여기에 내용을 입력하세요.</p>`,
    immediatelyRender: false,
  });

  const onVideoUploadComplete = async (videoFile: File) => {
    // 동영상 파일 크기 제한
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (videoFile.size > maxSize) {
      alert("동영상 파일 크기가 100MB를 초과합니다.");
      return;
    }

    // S3 서버에 동영상 업로드, 작성하기와 동시에 하지 않는 이유는 동영상 업로드 시간이 오래 걸리기 때문
    setIsUploading(true);
    try {
      const videoUrl = "await uploadToS3()";
      setUploadedVideoUrl(videoUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const extractEditorContentFromDoc = (
    editor: Editor // tiptap Editor 인스턴스
  ): EditorContentBlock[] => {
    const blocks: EditorContentBlock[] = [];

    editor.state.doc.forEach((node, offset, index) => {
      // 이미지 블록
      if (node.type.name === "image") {
        const id = node.attrs.id ?? uuidv4();
        blocks.push({
          type: "image",
          content: node.attrs.src ?? "",
          id,
          isMain: node.attrs.isMain || false,
          width:
            node.attrs.width != null ? String(node.attrs.width) : undefined,
          height:
            node.attrs.height != null ? String(node.attrs.height) : undefined,
        });
      }
      // 텍스트 블록 (예: paragraph)
      if (node.type.name === "paragraph") {
        const align =
          node.attrs.textAlign ||
          (node.attrs.align ? node.attrs.align : "left");

        const spanContents: {
          text: string;
          tags: ("strong" | "em" | "u" | "s")[];
          styles: { fontSize?: string; fontFamily?: string; color?: string };
        }[] = [];

        // span 같은 inline 마크업 순회
        node.forEach((child, _off, _i) => {
          if (child.type.name === "text") {
            const tags: ("strong" | "em" | "u" | "s")[] = [];
            if (child.marks.some((m) => m.type.name === "bold"))
              tags.push("strong");
            if (child.marks.some((m) => m.type.name === "italic"))
              tags.push("em");
            if (child.marks.some((m) => m.type.name === "underline"))
              tags.push("u");
            if (child.marks.some((m) => m.type.name === "strike"))
              tags.push("s");

            // 스타일 추출(확장 마크/커스텀 스타일이 있다면 marks에서 추출)
            const styles: {
              fontSize?: string;
              fontFamily?: string;
              color?: string;
            } = {};

            child.marks.forEach((mark) => {
              if (mark.type.name === "textStyle") {
                if (mark.attrs.fontSize) styles.fontSize = mark.attrs.fontSize;
                if (mark.attrs.fontFamily)
                  styles.fontFamily = mark.attrs.fontFamily;
                if (mark.attrs.color) styles.color = mark.attrs.color;
              }
            });

            spanContents.push({
              text: child.text ?? "",
              tags,
              styles,
            });
          }
        });

        blocks.push({
          type: "text",
          content:
            spanContents.length > 0
              ? spanContents
              : [{ text: "", tags: [], styles: {} }],
          id: uuidv4(),
          align,
        });
      }
      // 링크 프리뷰 노드
      if (node.type.name === "linkPreview") {
        const id = node.attrs.id ?? uuidv4();
        blocks.push({
          type: "link",
          content: node.attrs.url,
          id,
        });
      }
    });

    return blocks;
  };

  const toISOStringFromDateAndTime = (date: Date, time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const combinedDate = new Date(date); // 복사

    combinedDate.setHours(hours);
    combinedDate.setMinutes(minutes);
    combinedDate.setSeconds(0);
    combinedDate.setMilliseconds(0);

    return combinedDate.toISOString(); // UTC 기준 ISO 문자열 반환
  };

  const onSavePost = async () => {
    if (!editor || isUploading) return;

    const editorContent = extractEditorContentFromDoc(editor);
    if (editor.isEmpty) {
      alert("내용을 입력해주세요.");
      return;
    }
    // 1. editorContent에서 이미지 정보 추출
    const imageInfo = editorContent.filter((item) => item.type === "image");
    const editorContentWithS3Url = editorContent;
    // 2. ImageInfo에서 id와 content를 추출해서 Map 형태로 저장, item.content에 이미 S3에 업로드된 이미지의 URL은 제외함
    const imageMap = new Map<string, string>(
      imageInfo
        .filter(
          (item) =>
            typeof item.content === "string" &&
            !item.content.startsWith("https://")
        )
        .map((item) => [item.id, item.content as string])
    );
    // 3. S3에 이미지 업로드
    const uploadImage = async () => {
      for (const [id, content] of imageMap.entries()) {
        const file = base64ToFile(content as string, id);
        const imageUrl = "await uploadToS3(file)";
        //editorContentWithS3Url에 추가
        const foundItem = editorContentWithS3Url.find((item) => item.id === id);
        if (foundItem) {
          foundItem.content = imageUrl;
        }
      }
    };
    setIsUploading(true);
    try {
      await uploadImage();
      const contentRequest: ContentRequest = {
        content: editorContentWithS3Url,
        videoUrl: uploadedVideoUrl || "",
        hashTags: hashtags.map((tag) => tag.trim()).filter((tag) => tag !== ""),
      };
      try {
        await contentApi.createContent(contentRequest);
      } catch (error) {
        console.error("저장 오류: ", error);
        alert("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setIsUploading(false);
      }
    } catch (error) {
      console.error("이미지 업로드 오류: ", error);
      alert("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      setIsUploading(false);
    }
  };

  const insertImage = (src: string) => {
    if (!editor) return;
    const { state, view } = editor;

    let imageCount = 0;
    state.doc.descendants((node) => {
      if (node.type.name === "image") imageCount++;
    });

    if (imageCount >= 10) {
      alert("이미지는 최대 10개까지 업로드할 수 있어요.");
      return;
    }

    const { selection } = state;
    let tr = state.tr;

    // NodeSelection && 선택 노드가 image인 경우
    if (
      selection instanceof NodeSelection &&
      selection.node.type.name === "image"
    ) {
      // 선택된 이미지 노드의 끝 위치
      const posAfter = selection.$from.pos + selection.node.nodeSize;
      // 새 이미지 노드를 만들고 해당 위치에 삽입
      const imageNode = state.schema.nodes.image.create({ src });
      tr = tr.insert(posAfter, imageNode);
      // 새 이미지 뒤에 커서 위치
      tr = tr.setSelection(TextSelection.near(tr.doc.resolve(posAfter + 1)));
      view.dispatch(tr);
      view.focus();
      return;
    }

    // 그 외의 경우(일반 커서/텍스트 선택 등)는 기존 방식대로
    const imageNode = state.schema.nodes.image.create({ src });
    tr = tr.replaceSelectionWith(imageNode);
    // 새 이미지 뒤로 커서 옮기기
    const newPosAfter = tr.selection.from + 1;
    tr = tr.setSelection(TextSelection.near(tr.doc.resolve(newPosAfter)));
    view.dispatch(tr);
    view.focus();
  };

  return (
    <div className="w-full flex justify-center min-h-screen">
      <div className="w-full max-w-5xl px-4 desktop:px-0 flex flex-col">
        {isUploading && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl px-8 py-6 shadow-default">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-main border-t-transparent rounded-full animate-spin" />
                <p className="text-base font-medium">업로드 중…</p>
              </div>
            </div>
          </div>
        )}

        <ToolBar editor={editor} insertImage={insertImage} />

        <VideoUploader
          uploadedVideoUrl={uploadedVideoUrl || ""}
          onDeleteVideo={() => setUploadedVideoUrl(null)}
          onVideoUploadComplete={onVideoUploadComplete}
        />

        <EditorContent
          editor={editor}
          className="grow py-5 outline-none relative z-10 mt-3"
          spellCheck={false}
        />

        <HashtagEditor hashtags={hashtags} setHashtags={setHashtags} />

        <div className="flex justify-end pt-6 border-t border-black/10 mt-8 mb-6">
          <button
            className={[
              "inline-flex items-center justify-center",
              "w-full desktop:w-[200px] h-11",
              "rounded-full bg-main text-white",
              "desktop:text-[15px] font-semibold",
              "shadow-default hover:shadow-md hover:-translate-y-0.5",
              "transition-all disabled:opacity-60 disabled:hover:translate-y-0 ",
            ].join(" ")}
            onClick={onSavePost}
            disabled={isUploading}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
