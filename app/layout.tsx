import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "行走的坐标｜革命史迹数字化寻访",
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
      <body>{children}</body>
    </html>
  );
}
