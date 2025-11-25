import "./globals.css";
import { Noto_Sans_KR, Nanum_Gothic } from "next/font/google";
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

const notoSansKr = Noto_Sans_KR({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-kr",
});

const nanumGothic = Nanum_Gothic({
  weight: ["400", "700"],
  subsets: ["latin"],
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
