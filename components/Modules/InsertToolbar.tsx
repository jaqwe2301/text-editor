"use client";

import { useAppDispatch } from "@/redux/hook";
import { openModal } from "@/redux/slices/modalSlice";

import AddVideoIcon from "public/assets/post/videocam.icon.svg";
import AddPlaceIcon from "public/assets/post/location_on.icon.svg";
import AddVoteIcon from "public/assets/post/ballot.icon.svg";
import ImageUploader from "./ImageUploader";

interface Props {
  onAddVote: () => void;
  insertImage: (imageUrl: string) => void;
  handleDeletePlace: () => void;
  setIsShowPlacesSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function InsertToolbar({
  insertImage,
}: {
  insertImage: (imageUrl: string) => void;
}) {
  return (
    <>
      <ImageUploader insertImage={insertImage} />
    </>
  );
}
