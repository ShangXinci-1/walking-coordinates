import type { Metadata } from "next";
import "../../styles/pages/outcomes.css";

export const metadata: Metadata = {
  title: "实践成果",
  description: "集中展示行走的坐标社会实践项目成果及其公开状态。",
};

export default function OutcomesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
