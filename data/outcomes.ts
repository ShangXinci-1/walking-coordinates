import type { OutcomeRecord } from "../lib/content/types";
import { DESIGN_SPEC_SOURCE_ID } from "./sources";

export const outcomes: readonly OutcomeRecord[] = [
  {
    id: "digital-exhibition",
    order: 1,
    title: {
      value: "北京红色史迹数字线上展厅",
      sourceIds: [DESIGN_SPEC_SOURCE_ID],
    },
    description: [
      {
        id: "digital-exhibition-description",
        text: "以寻访路线为叙事骨架，整合影像、地点档案与青年解说。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    ownerRole: "outcome-owner",
    reviewStatus: "draft",
    publicationStatus: "planned",
    assetId: "placeholder-outcome-01",
    updatedAt: "2026-07-27",
    completionStatus: "planned",
    deliveryCondition: "提供可公开访问的展厅地址、成果负责人确认和发布日期。",
    access: null,
    publishedAt: null,
  },
  {
    id: "digital-archive",
    order: 2,
    title: {
      value: "数字档案",
      sourceIds: [DESIGN_SPEC_SOURCE_ID],
    },
    description: [
      {
        id: "digital-archive-description",
        text: "核心史迹影像、环境记录与口述材料的结构化归档。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    ownerRole: "outcome-owner",
    reviewStatus: "draft",
    publicationStatus: "planned",
    assetId: "placeholder-outcome-02",
    updatedAt: "2026-07-27",
    completionStatus: "planned",
    deliveryCondition: "提供可公开的档案样例、字段说明和访问权限确认。",
    access: null,
    publishedAt: null,
  },
  {
    id: "short-film",
    order: 3,
    title: {
      value: "主题微电影",
      sourceIds: [DESIGN_SPEC_SOURCE_ID],
    },
    description: [
      {
        id: "short-film-description",
        text: "以青年镜头串联寻访现场，形成可传播的影像作品。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    ownerRole: "outcome-owner",
    reviewStatus: "draft",
    publicationStatus: "planned",
    assetId: "placeholder-outcome-03",
    updatedAt: "2026-07-27",
    completionStatus: "planned",
    deliveryCondition: "提供正式影片、封面、字幕、时长、授权和播放入口。",
    access: null,
    publishedAt: null,
  },
  {
    id: "research-report",
    order: 4,
    title: {
      value: "实践调研报告",
      sourceIds: [DESIGN_SPEC_SOURCE_ID],
    },
    description: [
      {
        id: "research-report-description",
        text: "梳理典型红色故事与数字化保护路径，沉淀可复用的方法经验。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    ownerRole: "outcome-owner",
    reviewStatus: "draft",
    publicationStatus: "planned",
    assetId: "placeholder-outcome-04",
    updatedAt: "2026-07-27",
    completionStatus: "planned",
    deliveryCondition: "提供正式报告文件、摘要、页数、发布日期和下载权限。",
    access: null,
    publishedAt: null,
  },
];
