import { useEffect } from "react";

export function useClickOutside(
  refs: React.RefObject<HTMLElement | null>[],
  onClickOutside: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const isOutside = refs.every(
        (ref) => ref.current && !ref.current.contains(event.target as Node)
      );

      if (isOutside) {
        onClickOutside();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, onClickOutside]);
}
