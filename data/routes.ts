import type { RouteRecord } from "../lib/content/types";
import {
  DESIGN_SPEC_SOURCE_ID,
  PROJECT_SCOPE_SOURCE_ID,
} from "./sources";

export const routes: readonly RouteRecord[] = [
  {
    id: "awakening",
    code: "A",
    slug: "awakening",
    title: {
      value: "觉醒之路",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID],
    },
    dayRange: {
      value: "第 2—4 天",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID],
    },
    summary: [
      {
        id: "awakening-summary",
        text: "从新文化运动的思想源头出发，追寻青年觉醒与信仰选择。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    coordinateRegion: "北京城区",
    siteIds: [
      "beida-honglou",
      "new-youth-editorial-office",
      "li-dazhao-residence",
      "jingbao-hall",
      "beijing-lu-xun-museum",
    ],
    heroAssetId: "placeholder-field-01",
    reviewStatus: "needs-review",
    publicationStatus: "placeholder",
  },
  {
    id: "war",
    code: "B",
    slug: "war",
    title: {
      value: "烽火之路",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID],
    },
    dayRange: {
      value: "第 5—7 天",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID],
    },
    summary: [
      {
        id: "war-summary",
        text: "走近抗战遗址与纪念场馆，在现场记录中聆听民族记忆。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    coordinateRegion: "北京城区与西部地区",
    siteIds: [
      "war-sculpture-park",
      "lugou-bridge",
      "wanping-city",
      "war-museum",
      "black-mountain-memorial",
    ],
    heroAssetId: "placeholder-field-03",
    reviewStatus: "needs-review",
    publicationStatus: "placeholder",
  },
  {
    id: "capital",
    code: "C",
    slug: "capital",
    title: {
      value: "进京之路",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID],
    },
    dayRange: {
      value: "第 10—11 天",
      sourceIds: [PROJECT_SCOPE_SOURCE_ID],
    },
    summary: [
      {
        id: "capital-summary",
        text: "沿着进京赶考的历史轨迹，理解初心如何化为时代使命。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    coordinateRegion: "北京西部与北部地区",
    siteIds: [
      "xiangshan-revolutionary-site",
      "cpc-history-exhibition",
      "qinghuayuan-station",
    ],
    heroAssetId: "placeholder-field-04",
    reviewStatus: "needs-review",
    publicationStatus: "placeholder",
  },
];
