import type { Metadata } from "next";
import "./globals.css";
import "../styles/components/foundation.css";
import "../styles/components/splash-cursor.css";
import SplashCursor from "../components/SplashCursor";

export const metadata: Metadata = {
  metadataBase: new URL("https://shangxinci-1.github.io/walking-coordinates/"),
  title: {
    default: "行走的坐标｜革命史迹数字化寻访",
    template: "%s｜行走的坐标",
  },
  description: "北京科技大学社会实践成果展示网站",
  icons: { icon: "/walking-coordinates/favicon.svg" },
  openGraph: {
    title: "行走的坐标｜革命史迹数字化寻访",
    description: "以脚步丈量历史，以技术保存记忆。",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        {/* 全站金色粒子拖尾（鼠标经过处泛起微光） */}
        <SplashCursor />
      </body>
    </html>
  );
}
