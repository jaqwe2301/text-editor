import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "./Providers";
// import DefaultModal from "@/components/Organisms/layout/modal/DefaultModal";
// import MiniModal from "@/components/Organisms/layout/modal/MiniModal";
// import NotificationModal from "@/components/Organisms/layout/modal/NotificationModal";
// import CheckMakeProfile from "@/components/_extensions/CheckMakeProfile";
// import { ModalLoading } from "@/components/Atoms/Loading";

const pretendard = localFont({
  src: "../utils/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const notoSansKr = localFont({
  src: [
    {
      path: "../utils/fonts/NotoSansKR-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../utils/fonts/NotoSansKR-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

const nanumGothic = localFont({
  src: [
    {
      path: "../utils/fonts/NanumGothic-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../utils/fonts/NanumGothic-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-nanum-gothic",
});

export const metadata: Metadata = {
  title: "📝 텍스트 에디터 📝",
  description: "텍스트 에디터입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} ${notoSansKr.variable} ${nanumGothic.variable} font-pretendard`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
