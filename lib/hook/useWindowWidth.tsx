import { useState, useEffect } from "react";

export const useWindowWidth = (isMobile?: true) => {
  const [width, setWidth] = useState<number>(isMobile ? 370 : 1920);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize(); // 초기값 설정
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width;
};
