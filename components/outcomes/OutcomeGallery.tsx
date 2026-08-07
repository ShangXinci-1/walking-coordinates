"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import type { AssetRecord } from "../../lib/content/types";
import { useStaggerReveal } from "../useStaggerReveal";
import { ResponsiveMedia } from "../ResponsiveMedia";
import "../../styles/components/stagger-reveal.css";

interface OutcomeGalleryProps {
  assets: readonly AssetRecord[];
}

export function OutcomeGallery({ assets }: OutcomeGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const gridRef = useStaggerReveal<HTMLDivElement>();
  const activeAsset = activeIndex === null ? null : assets[activeIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeIndex !== null && !dialog.open) {
      dialog.showModal();
    } else if (activeIndex === null && dialog.open) {
      dialog.close();
    }
  }, [activeIndex]);

  function openLightbox(index: number, trigger: HTMLButtonElement) {
    lastTriggerRef.current = trigger;
    setActiveIndex(index);
  }

  function closeLightbox() {
    dialogRef.current?.close();
  }

  function restoreTriggerFocus() {
    setActiveIndex(null);
    requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }

  function selectRelativeAsset(direction: -1 | 1) {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current + direction + assets.length) % assets.length;
    });
  }

  function trapDialogFocus(event: ReactKeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;

    const focusableElements = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      ),
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements.at(-1);

    if (
      event.shiftKey &&
      firstElement &&
      document.activeElement === firstElement
    ) {
      event.preventDefault();
      lastElement?.focus();
    } else if (
      !event.shiftKey &&
      lastElement &&
      document.activeElement === lastElement
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  return (
    <section
      className="outcome-gallery"
      aria-labelledby="outcome-gallery-title"
    >
      <header className="outcome-gallery__heading">
        <p>五个现场叙事位置</p>
        <div>
          <h2 id="outcome-gallery-title">从进入现场，到成果形成。</h2>
          <p>五个画面依次记录进入、同行、采集、访谈与社区传播。</p>
        </div>
      </header>

      <div className="outcome-gallery__grid" ref={gridRef}>
        {assets.map((asset, index) => (
          <button
            type="button"
            className="outcome-gallery__item"
            style={{ "--i": index } as CSSProperties}
            aria-haspopup="dialog"
            aria-label={`查看第 ${index + 1} 张：${asset.label}`}
            onClick={(event) => openLightbox(index, event.currentTarget)}
            ref={(element) => {
              triggerRefs.current[index] = element;
            }}
            key={asset.id}
          >
            <ResponsiveMedia
              asset={asset}
              sizes="(min-width: 900px) 33vw, 100vw"
            />
            <span className="outcome-gallery__item-caption">
              <small>{String(index + 1).padStart(2, "0")}</small>
              <strong>{asset.label}</strong>
              <span>点击放大</span>
            </span>
          </button>
        ))}
      </div>

      <dialog
        className="outcome-lightbox"
        aria-labelledby="outcome-lightbox-title"
        aria-describedby="outcome-lightbox-description"
        ref={dialogRef}
        onClose={restoreTriggerFocus}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeLightbox();
        }}
        onKeyDown={(event) => {
          trapDialogFocus(event);
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            selectRelativeAsset(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            selectRelativeAsset(1);
          }
        }}
      >
        {activeAsset && activeIndex !== null && (
          <div className="outcome-lightbox__panel">
            <header>
              <p>{activeAsset.displayUse}</p>
              <p>
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(assets.length).padStart(2, "0")}
              </p>
              <button
                type="button"
                aria-label="关闭图片灯箱"
                onClick={closeLightbox}
                autoFocus
              >
                关闭 <span aria-hidden="true">×</span>
              </button>
            </header>

            <figure>
              <ResponsiveMedia asset={activeAsset} sizes="90vw" />
              <figcaption>
                <h3 id="outcome-lightbox-title">{activeAsset.label}</h3>
                <p id="outcome-lightbox-description">
                  {activeAsset.alt}
                </p>
                <small>{activeAsset.id}</small>
              </figcaption>
            </figure>

            <nav aria-label="灯箱图片切换">
              <button
                type="button"
                aria-label="查看上一张图片"
                onClick={() => selectRelativeAsset(-1)}
              >
                ← 上一张
              </button>
              <button
                type="button"
                aria-label="查看下一张图片"
                onClick={() => selectRelativeAsset(1)}
              >
                下一张 →
              </button>
            </nav>
          </div>
        )}
      </dialog>
    </section>
  );
}
