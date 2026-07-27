import type { ProjectRecord } from "../lib/content/types";
import {
  DESIGN_SPEC_SOURCE_ID,
  PROJECT_SCOPE_SOURCE_ID,
} from "./sources";

export const project = {
  title: {
    value: "行走的坐标",
    sourceIds: [DESIGN_SPEC_SOURCE_ID],
  },
  subtitle: {
    value: "革命史迹数字化寻访",
    sourceIds: [DESIGN_SPEC_SOURCE_ID],
  },
  durationDays: {
    value: 14,
    sourceIds: [PROJECT_SCOPE_SOURCE_ID],
  },
  reviewStatus: "reviewed",
  publicationStatus: "ready",
} satisfies ProjectRecord;
