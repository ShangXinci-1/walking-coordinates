"use client";

import { useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";
import { ResponsiveMedia } from "../ResponsiveMedia";
import { getAssetById } from "../../lib/content/selectors";
import type { RouteId, RouteRecord } from "../../lib/content/types";

interface RouteIndexProps {
  routes: readonly RouteRecord[];
  activeRouteId: RouteId;
  onSelect: (route: RouteRecord) => void;
}

export function RouteIndex({
  routes,
  activeRouteId,
  onSelect,
}: RouteIndexProps) {
  const pendingFocusRoute = useRef<RouteId | null>(null);

  useEffect(() => {
    if (pendingFocusRoute.current !== activeRouteId) return;
    const frame = requestAnimationFrame(() => {
      document
        .querySelector<HTMLButtonElement>(
          `[data-route-id="${activeRouteId}"]`,
        )
        ?.focus();
      pendingFocusRoute.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [activeRouteId]);

  function moveFocus(
    event: KeyboardEvent<HTMLButtonElement>,
    routeIndex: number,
  ) {
    const direction =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;

    if (!direction) return;
    event.preventDefault();
    const nextIndex = (routeIndex + direction + routes.length) % routes.length;
    pendingFocusRoute.current = routes[nextIndex].id;
    onSelect(routes[nextIndex]);
  }

  return (
    <nav className="route-index" aria-label="路线索引">
      <div className="route-index__heading">
        <span aria-hidden="true">01</span>
        <div>
          <strong>路线索引</strong>
          <small>北京地区 · 三条主题路线</small>
        </div>
      </div>
      <div className="route-index__tabs" role="tablist" aria-label="选择路线">
        {routes.map((route, index) => {
          const selected = route.id === activeRouteId;
          const asset = getAssetById(route.heroAssetId);
          return (
            <button
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              data-route-index={index}
              data-route-id={route.id}
              className="route-index__tab"
              onClick={() => onSelect(route)}
              onKeyDown={(event) => moveFocus(event, index)}
              key={route.id}
            >
              {asset ? (
                <span className="route-index__visual" aria-hidden="true">
                  <ResponsiveMedia
                    asset={asset}
                    className="route-index__image"
                    sizes="(min-width: 1280px) 20vw, 1px"
                  />
                </span>
              ) : null}
              <span className="route-index__copy">
                <span className="route-index__code">路线 {route.code}</span>
                <strong>{route.title.value}</strong>
                <small>
                  {route.dayRange.value} · {route.siteIds.length} 处地点
                </small>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
