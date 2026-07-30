export type ReviewStatus = "draft" | "needs-review" | "reviewed";

export type PublicationStatus =
  | "placeholder"
  | "planned"
  | "partial"
  | "ready";

export type RouteId = "awakening" | "war" | "capital";
export type CoordinateTarget = "main-entrance" | "site-center";

export interface SourceRecord {
  id: string;
  title: string;
  publisher: string;
  url: string | null;
  recordRef: string | null;
  level: "A" | "B" | "C";
  sourceType:
    | "official-venue"
    | "government"
    | "project-record"
    | "publication"
    | "geocoder";
  accessedAt: string;
}

export interface SourcedField<T> {
  value: T;
  sourceIds: string[];
}

export interface SourcedContentBlock {
  id: string;
  text: string;
  sourceIds: string[];
}

export type CoordinateRecord =
  | {
      status: "missing";
    }
  | {
      status: "candidate";
      lat: number;
      lng: number;
      crs: "GCJ-02";
      target: CoordinateTarget;
      sourceId: SourceRecord["id"];
      queriedAt: string;
    }
  | {
      status: "verified";
      lat: number;
      lng: number;
      crs: "GCJ-02";
      target: CoordinateTarget;
      precision: "verified-poi" | "manual-pin";
      sourceId: SourceRecord["id"];
      verifiedAt: string;
      verifiedBy: "coordinate-reviewer" | "project-owner";
    };

export interface RouteRecord {
  id: RouteId;
  code: "A" | "B" | "C";
  slug: string;
  title: SourcedField<string>;
  dayRange: SourcedField<string>;
  summary: SourcedContentBlock[];
  coordinateRegion: string;
  siteIds: string[];
  heroAssetId: string;
  reviewStatus: ReviewStatus;
  publicationStatus: PublicationStatus;
}

export interface SiteRecord {
  id: string;
  slug: string;
  routeId: RouteId;
  order: number;
  name: SourcedField<string>;
  officialAddress: SourcedField<string> | null;
  coordinateTarget: CoordinateTarget;
  coordinate: CoordinateRecord;
  historySummary: SourcedContentBlock[];
  practiceSummary: SourcedContentBlock[];
  assetIds: string[];
  /** Detailed narrative content shown in the site detail overlay */
  detailContent: SourcedContentBlock[];
  /** Asset IDs for the image carousel in the detail overlay */
  galleryAssetIds: string[];
  reviewStatus: ReviewStatus;
  publicationStatus: PublicationStatus;
}

export interface AssetBase {
  id: string;
  label: string;
  displayUse: string;
  role:
    | "hero"
    | "route"
    | "site-cover"
    | "action"
    | "detail"
    | "portrait"
    | "outcome"
    | "video"
    | "vr"
    | "document";
  alt: string;
  shotRequirement: string;
  width: number;
  height: number;
  reviewStatus: ReviewStatus;
  publicationStatus: PublicationStatus;
  rightsStatus: "unknown" | "restricted" | "cleared";
  consentStatus: "not-required" | "pending" | "obtained";
  usageScopes: Array<"website" | "social" | "press" | "archive">;
  rightsRecordRef: string | null;
}

export type AssetRecord =
  | (AssetBase & {
      assetStatus: "placeholder" | "planned";
      placeholderSrc: string;
    })
  | (AssetBase & {
      assetStatus: "ready";
      rightsStatus: "cleared";
      consentStatus: "not-required" | "obtained";
      finalSrc: string;
      credit: string;
      captureDate: string;
    });

export interface OutcomeBase {
  id: string;
  order: number;
  title: SourcedField<string>;
  description: SourcedContentBlock[];
  ownerRole: string;
  reviewStatus: ReviewStatus;
  publicationStatus: PublicationStatus;
  assetId: string | null;
  updatedAt: string;
}

export type OutcomeRecord =
  | (OutcomeBase & {
      completionStatus: "planned" | "in-progress";
      deliveryCondition: string;
      access: null;
      publishedAt: null;
    })
  | (OutcomeBase & {
      completionStatus: "complete";
      deliveryCondition: null;
      access: {
        kind: "link" | "download" | "play";
        href: string;
        label: string;
      };
      publishedAt: string;
    });

export type LegacyQuoteRecord =
  | {
      status: "missing";
      placeholder: SourcedField<string>;
      evidenceRequirement: string;
      reviewStatus: ReviewStatus;
      publicationStatus: "planned";
    }
  | {
      status: "verified";
      quote: SourcedField<string>;
      speaker: SourcedField<string>;
      context: SourcedField<string>;
      verifiedAt: string;
      reviewStatus: "reviewed";
      publicationStatus: "partial" | "ready";
    };

interface LegacyImpactBase {
  id: string;
  order: number;
  title: SourcedField<string>;
  description: SourcedContentBlock[];
  assetId: string;
  reviewStatus: ReviewStatus;
  publicationStatus: PublicationStatus;
}

export type LegacyImpactRecord =
  | (LegacyImpactBase & {
      evidenceStatus: "missing";
      evidenceRequirement: string;
      evidenceRef: null;
    })
  | (LegacyImpactBase & {
      evidenceStatus: "verified";
      evidenceRequirement: null;
      evidenceRef: string;
      reviewStatus: "reviewed";
      publicationStatus: "partial" | "ready";
    });

export interface LegacyTimelineRecord {
  id: string;
  order: number;
  period: SourcedField<string>;
  title: SourcedField<string>;
  description: SourcedContentBlock[];
  evidenceStatus: "planned" | "verified";
  reviewStatus: ReviewStatus;
  publicationStatus: PublicationStatus;
}

export interface ProjectRecord {
  title: SourcedField<string>;
  subtitle: SourcedField<string>;
  durationDays: SourcedField<number>;
  reviewStatus: ReviewStatus;
  publicationStatus: PublicationStatus;
}
