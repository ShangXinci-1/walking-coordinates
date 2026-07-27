import { assets } from "../../data/assets";
import { outcomes } from "../../data/outcomes";
import { project } from "../../data/project";
import { routes } from "../../data/routes";
import { sites } from "../../data/sites";
import { sources } from "../../data/sources";
import type {
  SourcedContentBlock,
  SourcedField,
} from "./types";

export interface ContentValidationIssue {
  code: string;
  recordId: string;
  message: string;
}

function findDuplicates(values: readonly string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }

  return [...duplicates];
}

function validateSourceIds(
  recordId: string,
  fieldName: string,
  sourceIds: readonly string[],
  knownSourceIds: ReadonlySet<string>,
  issues: ContentValidationIssue[],
) {
  if (sourceIds.length === 0) {
    issues.push({
      code: "missing-field-source",
      recordId,
      message: `字段 ${fieldName} 没有来源`,
    });
  }

  for (const sourceId of sourceIds) {
    if (!knownSourceIds.has(sourceId)) {
      issues.push({
        code: "unknown-field-source",
        recordId,
        message: `字段 ${fieldName} 引用了不存在的来源：${sourceId}`,
      });
    }
  }
}

function validateSourcedField(
  recordId: string,
  fieldName: string,
  field: SourcedField<unknown>,
  knownSourceIds: ReadonlySet<string>,
  issues: ContentValidationIssue[],
) {
  if (
    field.value === null ||
    field.value === undefined ||
    (typeof field.value === "string" && field.value.trim() === "")
  ) {
    issues.push({
      code: "empty-sourced-field",
      recordId,
      message: `字段 ${fieldName} 为空`,
    });
  }

  validateSourceIds(
    recordId,
    fieldName,
    field.sourceIds,
    knownSourceIds,
    issues,
  );
}

function validateContentBlocks(
  recordId: string,
  fieldName: string,
  blocks: readonly SourcedContentBlock[],
  knownSourceIds: ReadonlySet<string>,
  issues: ContentValidationIssue[],
) {
  for (const block of blocks) {
    if (block.text.trim() === "") {
      issues.push({
        code: "empty-content-block",
        recordId,
        message: `字段 ${fieldName} 的内容块 ${block.id} 为空`,
      });
    }

    validateSourceIds(
      recordId,
      `${fieldName}.${block.id}`,
      block.sourceIds,
      knownSourceIds,
      issues,
    );
  }
}

export function validateContent() {
  const issues: ContentValidationIssue[] = [];
  const routeIds = new Set<string>(routes.map((route) => route.id));
  const assetIds = new Set<string>(assets.map((asset) => asset.id));
  const sourceIds = new Set<string>(sources.map((source) => source.id));

  for (const duplicate of findDuplicates(routes.map((route) => route.id))) {
    issues.push({
      code: "duplicate-route-id",
      recordId: duplicate,
      message: `路线 ID 重复：${duplicate}`,
    });
  }

  for (const duplicate of findDuplicates(sites.map((site) => site.id))) {
    issues.push({
      code: "duplicate-site-id",
      recordId: duplicate,
      message: `地点 ID 重复：${duplicate}`,
    });
  }

  for (const duplicate of findDuplicates(sites.map((site) => site.slug))) {
    issues.push({
      code: "duplicate-site-slug",
      recordId: duplicate,
      message: `地点 slug 重复：${duplicate}`,
    });
  }

  for (const duplicate of findDuplicates(assets.map((asset) => asset.id))) {
    issues.push({
      code: "duplicate-asset-id",
      recordId: duplicate,
      message: `素材 ID 重复：${duplicate}`,
    });
  }

  for (const duplicate of findDuplicates(sources.map((source) => source.id))) {
    issues.push({
      code: "duplicate-source-id",
      recordId: duplicate,
      message: `来源 ID 重复：${duplicate}`,
    });
  }

  for (const source of sources) {
    if (Boolean(source.url) === Boolean(source.recordRef)) {
      issues.push({
        code: "invalid-source-locator",
        recordId: source.id,
        message: "来源必须且只能具有 url 或 recordRef 之一",
      });
    }
  }

  validateSourcedField(
    "project",
    "title",
    project.title,
    sourceIds,
    issues,
  );
  validateSourcedField(
    "project",
    "subtitle",
    project.subtitle,
    sourceIds,
    issues,
  );
  validateSourcedField(
    "project",
    "durationDays",
    project.durationDays,
    sourceIds,
    issues,
  );

  for (const route of routes) {
    validateSourcedField(
      route.id,
      "title",
      route.title,
      sourceIds,
      issues,
    );
    validateSourcedField(
      route.id,
      "dayRange",
      route.dayRange,
      sourceIds,
      issues,
    );
    validateContentBlocks(
      route.id,
      "summary",
      route.summary,
      sourceIds,
      issues,
    );

    if (!assetIds.has(route.heroAssetId)) {
      issues.push({
        code: "missing-route-asset",
        recordId: route.id,
        message: `路线引用了不存在的 Hero 素材：${route.heroAssetId}`,
      });
    }

    for (const siteId of route.siteIds) {
      const site = sites.find((candidate) => candidate.id === siteId);
      if (!site) {
        issues.push({
          code: "missing-route-site",
          recordId: route.id,
          message: `路线引用了不存在的地点：${siteId}`,
        });
      } else if (site.routeId !== route.id) {
        issues.push({
          code: "route-site-mismatch",
          recordId: site.id,
          message: `地点所属路线 ${site.routeId} 与引用路线 ${route.id} 不一致`,
        });
      }
    }

    const routeSites = sites.filter((site) => site.routeId === route.id);
    for (const order of findDuplicates(
      routeSites.map((site) => String(site.order)),
    )) {
      issues.push({
        code: "duplicate-site-order",
        recordId: route.id,
        message: `路线中的地点顺序重复：${order}`,
      });
    }
  }

  for (const site of sites) {
    validateSourcedField(
      site.id,
      "name",
      site.name,
      sourceIds,
      issues,
    );
    if (site.officialAddress) {
      validateSourcedField(
        site.id,
        "officialAddress",
        site.officialAddress,
        sourceIds,
        issues,
      );
    }
    validateContentBlocks(
      site.id,
      "historySummary",
      site.historySummary,
      sourceIds,
      issues,
    );
    validateContentBlocks(
      site.id,
      "practiceSummary",
      site.practiceSummary,
      sourceIds,
      issues,
    );

    if (!routeIds.has(site.routeId)) {
      issues.push({
        code: "missing-site-route",
        recordId: site.id,
        message: `地点引用了不存在的路线：${site.routeId}`,
      });
    }

    if (
      !routes.some(
        (route) =>
          route.id === site.routeId &&
          route.siteIds.some((siteId) => siteId === site.id),
      )
    ) {
      issues.push({
        code: "unlisted-site",
        recordId: site.id,
        message: "地点未出现在所属路线的 siteIds 中",
      });
    }

    for (const assetId of site.assetIds) {
      if (!assetIds.has(assetId)) {
        issues.push({
          code: "missing-site-asset",
          recordId: site.id,
          message: `地点引用了不存在的素材：${assetId}`,
        });
      }
    }

    if (
      site.coordinate.status !== "missing" &&
      !sourceIds.has(site.coordinate.sourceId)
    ) {
      issues.push({
        code: "missing-coordinate-source",
        recordId: site.id,
        message: `坐标引用了不存在的来源：${site.coordinate.sourceId}`,
      });
    }

    if (
      (site.publicationStatus === "partial" ||
        site.publicationStatus === "ready") &&
      (site.reviewStatus !== "reviewed" ||
        !site.officialAddress ||
        site.coordinate.status !== "verified" ||
        site.historySummary.length === 0 ||
        site.practiceSummary.length === 0)
    ) {
      issues.push({
        code: "incomplete-published-site",
        recordId: site.id,
        message: "部分开放或已开放地点必须完成审核、地址、坐标和两类摘要",
      });
    }
  }

  for (const asset of assets) {
    if (asset.rightsStatus === "cleared" && !asset.rightsRecordRef) {
      issues.push({
        code: "missing-rights-record",
        recordId: asset.id,
        message: "已清权素材必须具有外部授权记录编号",
      });
    }

    if (
      asset.publicationStatus === "ready" &&
      (asset.assetStatus !== "ready" ||
        asset.reviewStatus !== "reviewed" ||
        asset.rightsStatus !== "cleared")
    ) {
      issues.push({
        code: "incomplete-ready-asset",
        recordId: asset.id,
        message: "已公开素材必须完成文件、审核、授权和人物同意",
      });
    }
  }

  for (const outcome of outcomes) {
    validateSourcedField(
      outcome.id,
      "title",
      outcome.title,
      sourceIds,
      issues,
    );
    validateContentBlocks(
      outcome.id,
      "description",
      outcome.description,
      sourceIds,
      issues,
    );

    if (outcome.assetId && !assetIds.has(outcome.assetId)) {
      issues.push({
        code: "missing-outcome-asset",
        recordId: outcome.id,
        message: `成果引用了不存在的素材：${outcome.assetId}`,
      });
    }

    if (
      outcome.publicationStatus === "ready" &&
      (outcome.reviewStatus !== "reviewed" ||
        outcome.completionStatus !== "complete" ||
        !outcome.access ||
        !outcome.publishedAt)
    ) {
      issues.push({
        code: "incomplete-ready-outcome",
        recordId: outcome.id,
        message: "已开放成果必须完成审核并具有真实访问动作和发布日期",
      });
    }

    if (
      outcome.completionStatus !== "complete" &&
      (!outcome.deliveryCondition || outcome.access !== null)
    ) {
      issues.push({
        code: "invalid-pending-outcome",
        recordId: outcome.id,
        message: "未完成成果必须具有交付条件且不能具有访问动作",
      });
    }
  }

  return issues;
}
