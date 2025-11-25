import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ModalType = "default" | "mini";

type ModalPayload =
  | (Omit<DefaultModalState, "isOpen"> & { modalType: "default" })
  | (Omit<MiniModalState, "isOpen"> & { modalType: "mini" });

interface BaseModalState {
  isOpen: boolean;
  modalType: ModalType;
}

interface DefaultModalState extends BaseModalState {
  subText: string;
  mainText: string;
  modalType: "default";
  confirmText: string;
  onConfirm: () => void;
  cancelBackground?: "bg-sub3" | "bg-sub2";
  cancelText?: string;
  onCancel?: () => void;
  isChangeButtonHandler?: boolean;
}

interface MiniModalState extends BaseModalState {
  modalType: "mini";
  title: string;
  confirmText: string;
  isBlue?: boolean;
  onCancel?: () => void;
  onConfirm: () => void;
}

type ModalState = DefaultModalState | MiniModalState;

const initialState: ModalState = {
  isOpen: false,
  modalType: "default",
  mainText: "",
  subText: "",
  onCancel: undefined,
  onConfirm: () => {},
  cancelText: "취소",
  confirmText: "",
  cancelBackground: "bg-sub3",
};

const modalSlice = createSlice({
  name: "modal",
  initialState: initialState as ModalState,
  reducers: {
    openModal: (_state, action: PayloadAction<ModalPayload>) => {
      return { ...action.payload, isOpen: true };
    },
    closeModal: (state) => {
      return { ...state, isOpen: false };
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
