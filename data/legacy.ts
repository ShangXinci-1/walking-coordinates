import type {
  LegacyImpactRecord,
  LegacyQuoteRecord,
  LegacyTimelineRecord,
} from "../lib/content/types";
import { DESIGN_SPEC_SOURCE_ID } from "./sources";

export const legacyQuote: LegacyQuoteRecord = {
  status: "missing",
  placeholder: {
    value: "人物原话待实践记录核验后发布。",
    sourceIds: [DESIGN_SPEC_SOURCE_ID],
  },
  evidenceRequirement:
    "需提供录音或访谈记录、说话者公开称谓、发生场景、授权状态和核验日期。",
  reviewStatus: "reviewed",
  publicationStatus: "planned",
};

export const legacyImpacts: readonly LegacyImpactRecord[] = [
  {
    id: "community-sharing",
    order: 1,
    title: {
      value: "社区传播",
      sourceIds: [DESIGN_SPEC_SOURCE_ID],
    },
    description: [
      {
        id: "community-sharing-description",
        text: "团队走进社区开展红色文化宣讲，以影像、访谈与互动交流的方式，向社区居民讲述寻访见闻与红色史迹故事。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
      {
        id: "community-sharing-detail",
        text: "宣讲围绕“实地循迹＋数字转化＋青年化传播”的实践理念展开：队员展示寻访中采集的影像素材，讲解北大红楼、京报馆、李大钊故居等史迹背后的革命故事，并与社区居民就红色文化的当代价值展开交流。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    assetId: "community-01",
    reviewStatus: "reviewed",
    publicationStatus: "partial",
    evidenceStatus: "verified",
    evidenceRequirement: null,
    evidenceRef: "社区宣讲活动记录 · 2026-08-04",
  },
];

export const legacyTimeline: readonly LegacyTimelineRecord[] = [
  {
    id: "field-visit",
    order: 1,
    period: { value: "实践现场", sourceIds: [DESIGN_SPEC_SOURCE_ID] },
    title: { value: "实地寻访", sourceIds: [DESIGN_SPEC_SOURCE_ID] },
    description: [
      {
        id: "field-visit-description",
        text: "沿三条路线进入革命史迹现场，完成影像、访谈、全景和笔记采集。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    evidenceStatus: "verified",
    reviewStatus: "reviewed",
    publicationStatus: "partial",
  },
  {
    id: "material-review",
    order: 2,
    period: { value: "资料整理", sourceIds: [DESIGN_SPEC_SOURCE_ID] },
    title: { value: "核验与归档", sourceIds: [DESIGN_SPEC_SOURCE_ID] },
    description: [
      {
        id: "material-review-description",
        text: "整理地点、来源与实践记录，通过字段级来源和授权门禁形成档案。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    evidenceStatus: "verified",
    reviewStatus: "reviewed",
    publicationStatus: "partial",
  },
  {
    id: "community-session",
    order: 3,
    period: { value: "社区宣讲", sourceIds: [DESIGN_SPEC_SOURCE_ID] },
    title: { value: "社区传播", sourceIds: [DESIGN_SPEC_SOURCE_ID] },
    description: [
      {
        id: "community-session-description",
        text: "走进社区开展红色文化宣讲，展示寻访影像，与居民交流红色文化的当代价值。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    evidenceStatus: "verified",
    reviewStatus: "reviewed",
    publicationStatus: "partial",
  },
  {
    id: "public-sharing",
    order: 4,
    period: { value: "公开传播", sourceIds: [DESIGN_SPEC_SOURCE_ID] },
    title: { value: "成果转化", sourceIds: [DESIGN_SPEC_SOURCE_ID] },
    description: [
      {
        id: "public-sharing-description",
        text: "核验后的内容进入数字展厅、档案、影片和报告，状态与访问动作同步公开。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    evidenceStatus: "planned",
    reviewStatus: "reviewed",
    publicationStatus: "planned",
  },
];
