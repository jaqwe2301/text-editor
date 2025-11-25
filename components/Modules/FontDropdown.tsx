import { FontFamily } from "@/types/editor";

interface Props {
  isMobile: boolean;
  fontStatus: string | null;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  fontOptions: FontFamily[] | number[];
  onSelectFontBtn: (selected: number | FontFamily) => void;
  style?: { top: number; left: number; width: number };
  selectedValue?: string | number;
}

export default function FontDropdown({
  style,
  isMobile,
  fontStatus,
  fontOptions,
  dropdownRef,
  onSelectFontBtn,
  selectedValue,
}: Props) {
  if (!fontStatus) return null;

  const positionStyle =
    isMobile && style
      ? {
          top: style.top,
          left: style.left,
          width: style.width,
        }
      : {};

  return (
    <div
      className={[
        "z-50 flex flex-col",
        "bg-white/95 backdrop-blur-md",
        "border border-black/5",
        "shadow-default rounded-2xl",
        "animate-in fade-in zoom-in-95 duration-150",
        isMobile
          ? "desktop:hidden fixed top-full right-0 mt-2 w-[180px] max-h-[45vh] overflow-auto p-2"
          : "mobile:hidden absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[260px] max-h-[360px] overflow-auto p-2",
      ].join(" ")}
      ref={dropdownRef}
      style={positionStyle}
    >
      <ul className="flex flex-col">
        {fontOptions.map((option) => {
          const key = typeof option === "object" ? option.value : option;
          const label = typeof option === "object" ? option.label : option;
          const value = typeof option === "object" ? option.value : option;

          const selected = selectedValue === value;

          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onSelectFontBtn(option)}
                className={[
                  "w-full flex items-center justify-between",
                  "px-3 py-2.5 rounded-xl text-left",
                  "text-sm desktop:text-base",
                  "transition-colors",
                  selected
                    ? "bg-main/10 text-main font-semibold"
                    : "hover:bg-black/5 text-black/80",
                  typeof option === "object" ? option.value : "",
                ].join(" ")}
              >
                <span>{label}</span>
                {selected && (
                  <span className="text-xs text-main/70">선택됨</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
