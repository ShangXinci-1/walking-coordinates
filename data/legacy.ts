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
        text: "社区宣讲、参与反馈与后续传播记录到位后，公开行动范围和实际反馈。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    assetId: "placeholder-legacy-02",
    reviewStatus: "reviewed",
    publicationStatus: "planned",
    evidenceStatus: "missing",
    evidenceRequirement: "提供活动记录、参与反馈、日期、地点和公开授权。",
    evidenceRef: null,
  },
  {
    id: "teaching-use",
    order: 2,
    title: {
      value: "课程使用",
      sourceIds: [DESIGN_SPEC_SOURCE_ID],
    },
    description: [
      {
        id: "teaching-use-description",
        text: "课程引用或教学使用形成记录后，说明使用场景、对象和材料范围。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    assetId: "placeholder-legacy-03",
    reviewStatus: "reviewed",
    publicationStatus: "planned",
    evidenceStatus: "missing",
    evidenceRequirement: "提供课程名称、使用材料、负责人确认和可公开证明。",
    evidenceRef: null,
  },
  {
    id: "archive-ingestion",
    order: 3,
    title: {
      value: "资料入库",
      sourceIds: [DESIGN_SPEC_SOURCE_ID],
    },
    description: [
      {
        id: "archive-ingestion-description",
        text: "数字资料完成归档或入库后，公开归档范围、字段结构和访问权限。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    assetId: "placeholder-legacy-03",
    reviewStatus: "reviewed",
    publicationStatus: "planned",
    evidenceStatus: "missing",
    evidenceRequirement: "提供归档清单、责任人确认、存储位置和访问权限说明。",
    evidenceRef: null,
  },
  {
    id: "screening-feedback",
    order: 4,
    title: {
      value: "成果展映",
      sourceIds: [DESIGN_SPEC_SOURCE_ID],
    },
    description: [
      {
        id: "screening-feedback-description",
        text: "成果展映或交流活动完成后，公开实际场次、观众反馈和后续行动。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    assetId: "placeholder-legacy-03",
    reviewStatus: "reviewed",
    publicationStatus: "planned",
    evidenceStatus: "missing",
    evidenceRequirement: "提供展映记录、现场影像、反馈摘要和公开授权。",
    evidenceRef: null,
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
    evidenceStatus: "planned",
    reviewStatus: "reviewed",
    publicationStatus: "planned",
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
    evidenceStatus: "planned",
    reviewStatus: "reviewed",
    publicationStatus: "planned",
  },
  {
    id: "public-sharing",
    order: 3,
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
  {
    id: "next-action",
    order: 4,
    period: { value: "后续行动", sourceIds: [DESIGN_SPEC_SOURCE_ID] },
    title: { value: "继续使用与反馈", sourceIds: [DESIGN_SPEC_SOURCE_ID] },
    description: [
      {
        id: "next-action-description",
        text: "以社区传播、课程使用、资料入库或展映反馈作为下一轮行动的证据。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    evidenceStatus: "planned",
    reviewStatus: "reviewed",
    publicationStatus: "planned",
  },
];
