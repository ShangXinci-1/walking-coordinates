import type { Metadata } from "next";
import { PracticeSite } from "./PracticeSite";

export const metadata: Metadata = {
  title: "行走的坐标｜革命史迹数字化寻访",
  description: "北京科技大学社会实践成果展示：以脚步丈量历史，以技术保存记忆。",
};

export default function Home() {
  return <PracticeSite />;
}
