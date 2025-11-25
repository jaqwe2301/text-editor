"use client";

import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { store } from "@/redux/store";

export const Providers = ({ children }: PropsWithChildren) => {
  return <Provider store={store}>{children}</Provider>;
};
