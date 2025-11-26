"use client";

import { useRef, useState, useEffect } from "react";

export default function HashtagEditor({
  hashtags,
  setHashtags,
}: {
  hashtags: string[];
  setHashtags: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [hashtagEditingIndex, setHashtagEditingIndex] = useState<number | null>(
    null
  );
  const [newHashtag, setNewHashtag] = useState<string>("");

  useEffect(() => {
    if (inputRef.current && spanRef.current) {
      const width = spanRef.current.offsetWidth;
      inputRef.current.style.width = `${width + 12}px`; // 여유 padding
    }
  }, [newHashtag]);

  const handleAddFirstTag = () => {
    setHashtags([""]);
    setHashtagEditingIndex(0);
  };

  const handleAddTag = () => {
    setHashtags((prev) => [...prev, ""]);
    setHashtagEditingIndex(hashtags.length);
  };

  const handleStartEditing = (index: number) => {
    setHashtagEditingIndex(index);
    setNewHashtag(hashtags[index] || "");
  };

  const handleTagUpdate = (index: number) => {
    const hashtag = newHashtag.trim();

    if (!hashtag) {
      setHashtags((prev) => prev.filter((_, i) => i !== index));
      setHashtagEditingIndex(null);
      setNewHashtag("");
      return;
    }

    const duplicateHashTagIndex = hashtags.indexOf(hashtag);
    if (index === duplicateHashTagIndex) {
      setHashtagEditingIndex(null);
      setNewHashtag("");
      return;
    }
    const updated = [...hashtags];
    updated[index] = hashtag;

    // 기존 해시태그와 중복되는지 확인
    if (duplicateHashTagIndex !== -1) {
      setHashtags((prev) =>
        prev.filter((_, idx) => idx !== duplicateHashTagIndex)
      );
    } else {
      setHashtags(updated);
    }
    setHashtagEditingIndex(null);
    setNewHashtag("");
  };

  const handleRemoveTag = (index: number) => {
    const updated = [...hashtags];
    updated.splice(index, 1);
    setHashtags(updated);
  };

  return (
    <div className="flex items-center">
      {/* 해시태그 공간 */}

      {hashtags.length === 0 ? (
        <button
          className="text-sm text-sub3 hover:text-sub4 transition-colors duration-300"
          onClick={handleAddFirstTag}
        >
          #해시태그를 추가해 보세요!
        </button>
      ) : (
        <div className="flex items-center flex-wrap gap-3">
          {hashtags.map((tag, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 bg-sub2 hover:bg-blue-200 text-gray-800 px-3 py-1 rounded-full shadow-sm transition"
            >
              {hashtagEditingIndex === idx ? (
                <div className="flex items-center gap-1 text-sub4">
                  #
                  <input
                    ref={inputRef}
                    value={newHashtag}
                    onChange={(e) => setNewHashtag(e.target.value)}
                    onBlur={() => handleTagUpdate(idx)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleTagUpdate(idx);
                      }
                    }}
                    autoFocus
                    className="bg-transparent outline-none text-sm"
                    maxLength={20}
                  />
                  {/* 숨겨진 span: input과 동일한 내용 */}
                  <span
                    ref={spanRef}
                    className="invisible absolute whitespace-pre text-sm font-normal"
                  >
                    {newHashtag || "a"}
                  </span>
                </div>
              ) : (
                <span
                  onClick={() => handleStartEditing(idx)}
                  className="cursor-pointer text-sm"
                >
                  #{tag}
                </span>
              )}
              <button
                onClick={() => handleRemoveTag(idx)}
                className="text-gray-500 hover:text-red-500 text-xs"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={handleAddTag}
            className="text-sm text-sub3 hover:text-sub4 transition-colors duration-300"
          >
            + 해시태그 추가
          </button>
        </div>
      )}
    </div>
  );
}
