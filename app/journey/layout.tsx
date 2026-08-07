import type { Metadata } from "next";
import "../../styles/pages/journey.css";

export const metadata: Metadata = {
  title: "寻访路线",
  description: "沿三条主题路线回看十三处北京革命史迹与团队寻访过程。",
};

export default function JourneyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
