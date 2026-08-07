import type { SourceRecord } from "../lib/content/types";

export const PROJECT_SCOPE_SOURCE_ID =
  "source-project-owner-routes-and-schedule";
export const DESIGN_SPEC_SOURCE_ID = "source-design-spec-v1-3";
export const AMAP_GEOCODER_SOURCE_ID = "source-amap-geocoder";

export const sources: readonly SourceRecord[] = [
  {
    id: PROJECT_SCOPE_SOURCE_ID,
    title: "13 个地点、路线顺序与 14 天日程确认",
    publisher: "项目负责人",
    url: null,
    recordRef: "project-confirmation:2026-07-27:routes-and-schedule",
    level: "A",
    sourceType: "project-record",
    accessedAt: "2026-07-27",
  },
  {
    id: DESIGN_SPEC_SOURCE_ID,
    title: "《行走的坐标》前端完整改版方案 V1.3",
    publisher: "项目组",
    url: null,
    recordRef: "repo:docs/行走的坐标-前端完整改版方案.md",
    level: "A",
    sourceType: "project-record",
    accessedAt: "2026-07-27",
  },
  {
    id: "source-beijing-red-tourism-directory",
    title: "北京市红色旅游景区名录",
    publisher: "北京市文化和旅游局",
    url: "https://whlyj.beijing.gov.cn/ggfw/ly/201803/t20180330_479277.html",
    recordRef: null,
    level: "A",
    sourceType: "government",
    accessedAt: "2026-07-27",
  },
  {
    id: "source-beida-honglou-beijing-gov",
    title: "中国共产党早期北京革命活动纪念馆（北大红楼）",
    publisher: "北京市人民政府门户网站",
    url: "https://www.beijing.gov.cn/renwen/rwzyd/qxdw/jxndqcqx/bdhl/202309/t20230918_3261540.html",
    recordRef: null,
    level: "A",
    sourceType: "government",
    accessedAt: "2026-07-27",
  },
  {
    id: "source-li-dazhao-residence-beijing-heritage",
    title: "北京李大钊故居",
    publisher: "北京市文物局",
    url: "https://wwj.beijing.gov.cn/bjww/wwjzzcslm/1737418/1738088/1742747/743762002/index.html",
    recordRef: null,
    level: "A",
    sourceType: "government",
    accessedAt: "2026-07-27",
  },
  {
    id: AMAP_GEOCODER_SOURCE_ID,
    title: "高德开放平台地理编码 API",
    publisher: "高德开放平台",
    url: "https://lbs.amap.com/api/webservice/guide/api/georegeo/",
    recordRef: null,
    level: "B",
    sourceType: "geocoder",
    accessedAt: "2026-07-27",
  },
];
