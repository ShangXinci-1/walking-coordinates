import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "薪火相传",
  description: "记录青年在革命史迹寻访中形成的理解、责任与传承。",
};

export default function LegacyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
