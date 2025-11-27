import Image from "next/image";
import { useState, useEffect, useRef } from "react";

import { Editor } from "@tiptap/core";
import { useWindowWidth } from "@/lib/hook/useWindowWidth";
import { FontFamily } from "@/types/editor";

import TextStyleToolbar from "../Modules/TextStyleToolbar";
import AlignToolbar from "../Modules/AlignToolbar";
import FontDropdown from "../Modules/FontDropdown";
import ImageUploader from "../Modules/ImageUploader";

interface Props {
  editor: Editor | null;
  insertImage: (imageUrl: string) => void;
}

const fontFamilies: FontFamily[] = [
  { label: "기본서체", value: "font-pretendard" },
  { label: "나눔고딕", value: "font-nanum-gothic" },
  { label: "노토산스", value: "font-noto-sans-kr" },
];
const fontSizes = [10, 15, 16, 19, 24, 28, 30, 34, 38];

export default function ToolBar({ editor, insertImage }: Props) {
  const width = useWindowWidth();
  const isMobile = width < 1200;

  const fontFamilyBtnRef = useRef<HTMLButtonElement>(null);
  const fontSizeBtnRef = useRef<HTMLButtonElement>(null);
  const fontSelectContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toolbarContainerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [draggingState, setDraggingState] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dropdownStyle, setDropdownStyle] = useState<{
    // 모바일에서만 사용될 드롭다운 위치
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });

  const [fontStatus, setFontStatus] = useState<
    "fontSize" | "fontFamily" | null
  >(null);
  const [selectedFontFamily, setSelectedFontFamily] = useState<FontFamily>({
    label: "기본서체",
    value: "font-pretendard",
  });
  const [selectedFontSize, setSelectedFontSize] = useState<number>(16);

  useEffect(() => {
    if (!editor) return;

    // 최초 마운트 시에도 1회 동기화
    const updateFontClass = () => {
      const cls: string =
        editor
          .getAttributes("fontFamilyClass")
          .class?.split(" ")
          .find((c: string) => c.startsWith("font-")) || "";
      const label = fontFamilies.find((f) => f.value === cls);

      const fontSizePx = editor.getAttributes("fontSize").fontSize || "16px";
      const fontSizeNumber = fontSizePx.replace("px", "");

      setSelectedFontFamily(
        label || { label: "기본서체", value: "font-pretendard" }
      );
      setSelectedFontSize(fontSizeNumber ? Number(fontSizeNumber) : 16);
    };

    updateFontClass(); // 최초 1회

    // selection 업데이트 이벤트 등록
    editor.on("selectionUpdate", updateFontClass);

    // 에디터 해제시 이벤트 클린업
    return () => {
      editor.off("selectionUpdate", updateFontClass);
    };
  }, [editor]);

  const addedTop = 50;

  useEffect(() => {
    const handleScroll = () => {
      if (fontFamilyBtnRef.current && fontStatus === "fontFamily") {
        const rect = fontFamilyBtnRef.current.getBoundingClientRect();
        setDropdownStyle((prevStyle) => ({
          ...prevStyle,
          top: rect.top + addedTop, // 스크롤 위치를 반영한 top 값 업데이트
        }));
      }

      if (fontSizeBtnRef.current && fontStatus === "fontSize") {
        const rect = fontSizeBtnRef.current.getBoundingClientRect();
        setDropdownStyle((prevStyle) => ({
          ...prevStyle,
          top: rect.top + addedTop, // 스크롤 위치를 반영한 top 값 업데이트
        }));
      }
    };

    // 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fontStatus]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        fontSelectContainerRef.current &&
        !fontSelectContainerRef.current.contains(event.target as Node) &&
        fontFamilyBtnRef.current &&
        !fontFamilyBtnRef.current.contains(event.target as Node) &&
        fontSizeBtnRef.current &&
        !fontSizeBtnRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setFontStatus(null);
      }
    }

    // 이벤트 리스너 추가
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchmove", handleClickOutside); // 터치 이동 시에도 스크롤 구분

    return () => {
      // 정리할 때 이벤트 리스너 제거
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchmove", handleClickOutside);
    };
  }, []);

  if (!editor) return null;

  const fontOptions = fontStatus === "fontFamily" ? fontFamilies : fontSizes;

  const onFontStatusBtn = (status: "fontSize" | "fontFamily") => {
    if (draggingState) {
      setDraggingState(false);
      return;
    }
    const addedTop = 50;
    if (fontFamilyBtnRef.current && status === "fontFamily") {
      const rect = fontFamilyBtnRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.top + addedTop,
        left: rect.left - 20,
        width: rect.width + 40,
      });
    }

    if (fontSizeBtnRef.current && status === "fontSize") {
      const rect = fontSizeBtnRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.top + addedTop,
        left: rect.left - 20,
        width: rect.width + 40,
      });
    }

    setFontStatus((prev) => (status === prev ? null : status));
  };

  const onSelectFontBtn = (selected: number | FontFamily) => {
    if (fontStatus === "fontFamily" && typeof selected === "object") {
      setSelectedFontFamily(selected);
      const chain = editor.chain();
      chain.focus().setFontFamilyClass(selected.value).run();
    } else if (fontStatus === "fontSize" && typeof selected === "number") {
      editor
        .chain()
        .focus()
        .setFontSize(String(selected) + "px")
        .run();
      setSelectedFontSize(selected);
    } else {
      alert("폰트 선택 시 일시적인 오류가 발생하였습니다. 다시 시도해 주세요.");
    }
    setFontStatus(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeft(toolbarContainerRef.current?.scrollLeft || 0);
  };

  // 마우스 드래그 이동 (데스크탑)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    setFontStatus(null);
    setDraggingState(true);

    const moveX = e.clientX - startX;
    if (toolbarContainerRef.current) {
      toolbarContainerRef.current.scrollLeft = scrollLeft - moveX;
    }
  };

  // 마우스 드래그 종료 (데스크탑)
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 마우스가 요소 밖으로 나갔을 때 드래그 종료 (데스크탑)
  const handleMouseLeave = () => {
    setIsDragging(false);
    setDraggingState(false);
  };

  return (
    <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/10">
      <div
        className={[
          "flex items-center gap-2 desktop:gap-3",
          "py-2 desktop:py-3 px-2 desktop:px-4",
          "overflow-x-auto scrollbar-hide",
        ].join(" ")}
      >
        <div
          ref={toolbarContainerRef}
          onTouchMove={() => setFontStatus(null)}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className={[
            "flex items-center gap-2 desktop:gap-3 w-full",
            "select-none",
            "min-w-max",
          ].join(" ")}
        >
          <div className="flex items-center gap-1 desktop:gap-2 shrink-0">
            <ImageUploader insertImage={insertImage} />
          </div>

          <div
            ref={fontSelectContainerRef}
            className={[
              "flex items-center gap-1 desktop:gap-2",
              "px-2 py-1 rounded-full bg-black/5",
              "shrink-0 whitespace-nowrap",
            ].join(" ")}
          >
            <button
              ref={fontFamilyBtnRef}
              onClick={() => onFontStatusBtn("fontFamily")}
              className={[
                "flex items-center gap-1 desktop:gap-2",
                "px-2 desktop:px-3 py-1.5 rounded-full",
                "hover:bg-white transition-colors",
                "whitespace-nowrap",
                "text-xs desktop:text-sm font-medium",
              ].join(" ")}
            >
              <span className="text-sm desktop:text-base font-medium">
                {selectedFontFamily.label}
              </span>
              <Image
                src="/assets/play_arrow.svg"
                alt="열기"
                width={16}
                height={16}
                className={[
                  "w-4 h-4 desktop:w-5 desktop:h-5",
                  "transition-transform duration-150",
                  fontStatus === "fontFamily" ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>

            <button
              ref={fontSizeBtnRef}
              onClick={() => onFontStatusBtn("fontSize")}
              className={[
                "flex items-center gap-1 desktop:gap-2",
                "px-2 desktop:px-3 py-1.5 rounded-full",
                "hover:bg-white transition-colors",
                "whitespace-nowrap",
                "text-xs desktop:text-sm font-medium",
              ].join(" ")}
            >
              <span className="text-sm desktop:text-base font-medium">
                {selectedFontSize}px
              </span>
              <Image
                src="/assets/play_arrow.svg"
                alt="열기"
                width={16}
                height={16}
                className={[
                  "w-4 h-4 desktop:w-5 desktop:h-5",
                  "transition-transform duration-150",
                  fontStatus === "fontFamily" ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>
          </div>

          <div className="flex items-center gap-1 desktop:gap-2 shrink-0">
            <TextStyleToolbar editor={editor} />
          </div>
          <div className="flex items-center gap-1 desktop:gap-2 shrink-0">
            <AlignToolbar editor={editor} />
          </div>
        </div>
      </div>

      <FontDropdown
        dropdownRef={dropdownRef}
        style={dropdownStyle}
        isMobile={isMobile}
        fontStatus={fontStatus}
        fontOptions={fontOptions}
        onSelectFontBtn={onSelectFontBtn}
        selectedValue={
          fontStatus === "fontFamily"
            ? selectedFontFamily.value
            : selectedFontSize
        }
      />
    </div>
  );
}
