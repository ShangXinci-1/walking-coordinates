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
      {
        id: "digital-exhibition-intro",
        text: "展厅按三条路线组织十三处地点分支，每处地点以实地采集的 VR 全景与实景影像呈现。观众可以像走进现场一样，在红楼、故居与展馆之间切换浏览，从空间尺度感受历史现场。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
      {
        id: "digital-exhibition-build",
        text: "团队使用全景相机与单反相机完成地点拍摄，配合现场记录表逐站核对坐标与素材。展厅内容与路线档案、实践记录共享同一套素材清单，保证每张图片都有出处、每个地点都有档案。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    ownerRole: "outcome-owner",
    reviewStatus: "draft",
    publicationStatus: "planned",
    assetId: "outcome-01",
    updatedAt: "2026-07-27",
    completionStatus: "planned",
    deliveryCondition: "展厅按三条路线组织十三处地点分支，逐站嵌入 VR 全景与实景影像。正式开放前需完成全部地点素材核验、展厅地址公开与成果负责人确认。",
    access: null,
    publishedAt: null,
  },
  {
    id: "digital-archive",
    order: 2,
    title: {
      value: "寻访新闻稿档案",
      sourceIds: [DESIGN_SPEC_SOURCE_ID],
    },
    description: [
      {
        id: "digital-archive-description",
        text: "按寻访地点归档的团队新闻稿，记录每次现场实践的所见所感。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
      {
        id: "digital-archive-intro",
        text: "每次寻访结束后，团队都会以新闻稿形式记录当天的行程、现场见闻与实践感悟。稿件按地点独立归档，涵盖北大红楼、京报馆、陈独秀旧居与李大钊故居等站点，形成可追溯的实践记录。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
      {
        id: "digital-archive-build",
        text: "新闻稿由参与当次寻访的队员共同撰写，经团队审核后归档，与地点档案、影像素材相互印证，让每次实践都有文字记录可查。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    ownerRole: "outcome-owner",
    reviewStatus: "draft",
    publicationStatus: "planned",
    assetId: "outcome-02",
    updatedAt: "2026-07-27",
    completionStatus: "planned",
    deliveryCondition: "档案覆盖十三处地点的正式名称、地址、坐标、历史摘要、实践记录与资料来源。正式公开前需完成字段样例、来源核验与访问权限确认。",
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
      {
        id: "short-film-intro",
        text: "影片以寻访过程中的真实画面为素材：队员进入场馆、观察展陈、与讲解员交流、采集资料的现场动作都被镜头记录，让观众跟随青年视角重新走一遍寻访路线。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
      {
        id: "short-film-build",
        text: "拍摄采用纪实风格，保留现场环境声与自然光线，不做摆拍。成片将按“进入现场—团队行动—对象细节—人物交流—成果形成”的结构剪辑，并配套字幕与时长信息。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    ownerRole: "outcome-owner",
    reviewStatus: "draft",
    publicationStatus: "planned",
    assetId: "outcome-03",
    updatedAt: "2026-07-27",
    completionStatus: "planned",
    deliveryCondition: "影片以寻访现场的真实画面为素材，按进入现场、团队行动、对象细节、人物交流、成果形成五段结构剪辑。交付需包含正式成片、封面、字幕、时长与播放入口。",
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
      {
        id: "research-report-intro",
        text: "报告以寻访所见的真实场景与访谈记录为基础，梳理革命史迹的保存现状与青年数字化记录的方法路径，形成一套可复用的实践流程。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
      {
        id: "research-report-build",
        text: "团队将按地点档案、影像清单、访谈摘录和问题讨论四个部分整理内容，逐章核对资料来源后定稿，并同步生成摘要与目录页。",
        sourceIds: [DESIGN_SPEC_SOURCE_ID],
      },
    ],
    ownerRole: "outcome-owner",
    reviewStatus: "draft",
    publicationStatus: "planned",
    assetId: "outcome-04",
    updatedAt: "2026-07-27",
    completionStatus: "planned",
    deliveryCondition: "报告按地点档案、影像清单、访谈摘录与问题讨论四部分整理，逐章核对资料来源后定稿。交付需包含正式文件、摘要、页数与发布日期。",
    access: null,
    publishedAt: null,
  },
];
