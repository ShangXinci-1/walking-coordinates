import type { RouteId } from "../lib/content/types";

export interface ExhibitionSite {
  id: string;
  routeId: RouteId;
  order: number;
  name: string;
  /** 720yun VR 全景链接；暂无时为空字符串 */
  vrUrl: string | null;
  /** VR 实景封面图（使用实地拍摄照片）；暂无时为空字符串 */
  coverSrc: string;
  /** 封面图替代文本 */
  coverAlt: string;
}

/** 线上展厅分支：对应十三处寻访地点 */
export const exhibitionSites: readonly ExhibitionSite[] = [
  {
    id: "beida-honglou",
    routeId: "awakening",
    order: 1,
    name: "北大红楼",
    vrUrl: "https://www.720yun.com/vr/73722as6jnn",
    coverSrc:
      "/media/beida-honglou/微信图片_20260728152513_564_1683.jpg",
    coverAlt: "北大红楼建筑外观实景",
  },
  {
    id: "new-youth-editorial-office",
    routeId: "awakening",
    order: 2,
    name: "《新青年》编辑部旧址",
    vrUrl: null,
    coverSrc:
      "/media/new-youth-editorial/微信图片_20260730142543_651_1683.jpg",
    coverAlt: "《新青年》编辑部旧址实景",
  },
  {
    id: "li-dazhao-residence",
    routeId: "awakening",
    order: 3,
    name: "李大钊故居",
    vrUrl: null,
    coverSrc: "/media/li-dazhao/微信图片_20260730144655_703_1683.jpg",
    coverAlt: "李大钊故居实景",
  },
  {
    id: "jingbao-hall",
    routeId: "awakening",
    order: 4,
    name: "京报馆旧址",
    vrUrl: null,
    coverSrc: "/media/jingbao-hall/微信图片_20260729114541_441_1683.jpg",
    coverAlt: "京报馆旧址实景",
  },
  {
    id: "beijing-lu-xun-museum",
    routeId: "awakening",
    order: 5,
    name: "北京鲁迅博物馆",
    vrUrl: null,
    coverSrc: "/media/lu-xun-museum/微信图片_20260731130210_853_1683.jpg",
    coverAlt: "北京鲁迅博物馆实景",
  },
  {
    id: "war-sculpture-park",
    routeId: "war",
    order: 1,
    name: "中国人民抗日战争纪念雕塑园",
    vrUrl: null,
    coverSrc: "",
    coverAlt: "",
  },
  {
    id: "lugou-bridge",
    routeId: "war",
    order: 2,
    name: "卢沟桥",
    vrUrl: null,
    coverSrc: "",
    coverAlt: "",
  },
  {
    id: "wanping-city",
    routeId: "war",
    order: 3,
    name: "宛平城",
    vrUrl: null,
    coverSrc: "",
    coverAlt: "",
  },
  {
    id: "war-museum",
    routeId: "war",
    order: 4,
    name: "中国人民抗日战争纪念馆",
    vrUrl: null,
    coverSrc: "",
    coverAlt: "",
  },
  {
    id: "black-mountain-memorial",
    routeId: "war",
    order: 5,
    name: "百望山黑山扈战斗纪念园",
    vrUrl: null,
    coverSrc: "",
    coverAlt: "",
  },
  {
    id: "xiangshan-revolutionary-site",
    routeId: "capital",
    order: 1,
    name: "香山革命纪念地",
    vrUrl: null,
    coverSrc: "",
    coverAlt: "",
  },
  {
    id: "cpc-history-exhibition",
    routeId: "capital",
    order: 2,
    name: "中国共产党历史展览馆",
    vrUrl: null,
    coverSrc: "",
    coverAlt: "",
  },
  {
    id: "qinghuayuan-station",
    routeId: "capital",
    order: 3,
    name: "清华园车站旧址",
    vrUrl: null,
    coverSrc: "",
    coverAlt: "",
  },
];

export const routeLabels: Record<RouteId, string> = {
  awakening: "觉醒之路",
  war: "烽火之路",
  capital: "进京之路",
};
