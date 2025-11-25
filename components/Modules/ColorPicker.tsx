"use client";

import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "@/lib/hook/useClickOutside";

interface ColorPickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

export default function ColorPicker({
  selectedColor,
  onColorSelect,
  onClose,
}: ColorPickerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [markerPosition, setMarkerPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useClickOutside([containerRef], onClose);

  // RGB → HEX 변환 함수
  const rgbToHex = (r: number, g: number, b: number) => {
    if (r > 250 && g > 250 && b > 250) return "#FFFFFF"; // 흰색 강제 적용
    return `#${((1 << 24) | (r << 16) | (g << 8) | b)
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 색상 그라디언트 생성
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "#ff0000");
    gradient.addColorStop(0.16, "#ff9900");
    gradient.addColorStop(0.33, "#ffff00");
    gradient.addColorStop(0.5, "#00ff00");
    gradient.addColorStop(0.66, "#0000ff");
    gradient.addColorStop(0.83, "#9900ff");
    gradient.addColorStop(1, "#FFFFFF");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 흑백 그라디언트 추가
    const blackWhiteGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    blackWhiteGradient.addColorStop(0, "rgba(255,255,255,1)");
    blackWhiteGradient.addColorStop(0.5, "rgba(255,255,255,0)");
    blackWhiteGradient.addColorStop(0.5, "rgba(0,0,0,0)");
    blackWhiteGradient.addColorStop(1, "rgba(0,0,0,1)");

    ctx.fillStyle = blackWhiteGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  // 색상 선택 핸들러 (마우스 클릭 & 드래그)
  const handleColorSelect = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hexColor = rgbToHex(pixel[0], pixel[1], pixel[2]);

    onColorSelect(hexColor); // 부모 상태 업데이트
    setMarkerPosition({ x, y }); // 마커 위치 업데이트
  };

  return (
    <div
      ref={containerRef}
      className="p-4 absolute top-[140%] z-20 border bg-white left-1/2 -translate-x-1/2 rounded-lg shadow-lg"
    >
      {/* 컬러 미리보기 */}
      <div className="flex items-center gap-4 mb-2">
        <div
          className="w-10 h-10 rounded-full border"
          style={{ backgroundColor: selectedColor }}
        />
        <span className="text-lg font-medium">{selectedColor}</span>
      </div>

      {/* Canvas 컬러 피커 */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={300}
          height={150}
          className="border cursor-pointer rounded"
          onMouseDown={handleColorSelect}
          onMouseMove={(e) => e.buttons === 1 && handleColorSelect(e)}
        />

        {/* 선택한 컬러 마커 */}
        {markerPosition && (
          <div
            className="absolute w-5 h-5 border-2 border-white rounded-full pointer-events-none"
            style={{
              left: `${markerPosition.x - 10}px`,
              top: `${markerPosition.y - 10}px`,
              backgroundColor: selectedColor,
            }}
          />
        )}
      </div>
    </div>
  );
}
