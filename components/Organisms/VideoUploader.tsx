"use client";

import { useState } from "react";
import Image from "next/image";
import { CiPlay1 } from "react-icons/ci";

export default function VideoUploader({
  uploadedVideoUrl,
  onDeleteVideo,
  onVideoUploadComplete,
}: {
  uploadedVideoUrl: string;
  onDeleteVideo: () => void;
  onVideoUploadComplete: (videoFile: File) => void;
}) {
  const [videoSrc, setVideoSrc] = useState<string | null>(uploadedVideoUrl);

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoSrc(videoUrl);
      onVideoUploadComplete(file);
    }
  };

  const handleDeleteVideo = () => {
    setVideoSrc(null);
    onDeleteVideo();
  };

  return (
    <div className="flex justify-center">
      <input
        id="videoInput"
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleVideoUpload}
      />

      {/* 동영상 미리보기 (재생 불가) */}
      {videoSrc && (
        <div className="relative w-full max-w-lg mt-4">
          {/* 비활성화된 동영상 */}
          <video
            className="w-full rounded-md shadow-lg pointer-events-none"
            muted
          >
            <source src={videoSrc} type="video/mp4" />
          </video>

          {/* 중앙 재생 아이콘 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="absolute top-5 right-5 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              onClick={handleDeleteVideo}
            >
              <Image
                src="/assets/close.svg"
                alt="닫기"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
            <div
              className="bg-black/50 p-4 rounded-full border border-sub3"
              onClick={(e) => e.preventDefault()}
            >
              <CiPlay1 className="text-white text-[25px]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
