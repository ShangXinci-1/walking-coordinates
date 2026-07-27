import type { CoordinateRecord } from "./types";

interface AmapGeocodeItem {
  formatted_address?: unknown;
  level?: unknown;
  location?: unknown;
}

interface AmapGeocodeResponse {
  status?: unknown;
  info?: unknown;
  geocodes?: unknown;
}

export interface GeocodeCandidate {
  coordinate: Extract<CoordinateRecord, { status: "candidate" }>;
  formattedAddress: string;
  level: string | null;
}

export function parseAmapGeocodeResponse(
  payload: AmapGeocodeResponse,
  sourceId: string,
  queriedAt: string,
): GeocodeCandidate[] {
  if (payload.status !== "1") {
    throw new Error(
      `高德地理编码失败：${typeof payload.info === "string" ? payload.info : "unknown"}`,
    );
  }

  if (!Array.isArray(payload.geocodes)) return [];

  return payload.geocodes.flatMap((item: AmapGeocodeItem) => {
    if (
      typeof item.location !== "string" ||
      typeof item.formatted_address !== "string"
    ) {
      return [];
    }

    const [lngText, latText] = item.location.split(",");
    const lng = Number(lngText);
    const lat = Number(latText);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      return [];
    }

    return [
      {
        coordinate: {
          status: "candidate",
          lat,
          lng,
          crs: "GCJ-02",
          target: "site-center",
          sourceId,
          queriedAt,
        },
        formattedAddress: item.formatted_address,
        level: typeof item.level === "string" ? item.level : null,
      },
    ];
  });
}
