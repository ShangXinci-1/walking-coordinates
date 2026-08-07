"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { useStaggerReveal } from "../useStaggerReveal";
import type { SiteRecord } from "../../lib/content/types";
import "../../styles/components/stagger-reveal.css";

interface SiteListProps {
  sites: readonly SiteRecord[];
  activeSiteId: string;
  onSelect: (site: SiteRecord, focusDossier?: boolean) => void;
}

export function SiteList({
  sites,
  activeSiteId,
  onSelect,
}: SiteListProps) {
  const pendingFocusSite = useRef<string | null>(null);
  const listRef = useStaggerReveal<HTMLOListElement>();

  useEffect(() => {
    if (pendingFocusSite.current !== activeSiteId) return;
    const frame = requestAnimationFrame(() => {
      document
        .querySelector<HTMLButtonElement>(
          `[data-site-id="${activeSiteId}"]`,
        )
        ?.focus();
      pendingFocusSite.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [activeSiteId]);

  function moveFocus(
    event: KeyboardEvent<HTMLButtonElement>,
    siteIndex: number,
  ) {
    const direction =
      event.key === "ArrowDown" || event.key === "ArrowRight"
        ? 1
        : event.key === "ArrowUp" || event.key === "ArrowLeft"
          ? -1
          : 0;

    if (!direction) return;
    event.preventDefault();
    const nextIndex = (siteIndex + direction + sites.length) % sites.length;
    pendingFocusSite.current = sites[nextIndex].id;
    onSelect(sites[nextIndex], false);
  }

  return (
    <nav className="site-list" aria-label="当前路线地点">
      <div className="site-list__heading">
        <span>地点目录</span>
        <small>{sites.length} 条记录</small>
      </div>
      <ol ref={listRef}>
        {sites.map((site, index) => {
          const selected = site.id === activeSiteId;
          return (
            <li key={site.id} style={{ "--i": index } as CSSProperties}>
              <button
                type="button"
                aria-current={selected ? "location" : undefined}
                tabIndex={selected ? 0 : -1}
                data-site-index={index}
                data-site-id={site.id}
                onClick={() => onSelect(site)}
                onKeyDown={(event) => moveFocus(event, index)}
              >
                <span className="site-list__number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="site-list__name">{site.name.value}</span>
                <span
                  className="site-list__coordinate-state"
                  data-verified={site.coordinate.status === "verified"}
                >
                  {site.coordinate.status === "verified" ? "已核验" : "待核验"}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
