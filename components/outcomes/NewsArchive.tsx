"use client";

import { useEffect, useRef, useState } from "react";
import { newsArchive } from "../../data/news";
import { withBasePath } from "../../lib/site";

interface NewsArchiveProps {
  onClose: () => void;
}

export function NewsArchive({ onClose }: NewsArchiveProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const openRecord =
    newsArchive.find((record) => record.id === openId) ?? null;

  /* ── keyboard: Esc 关闭 ── */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (openId) {
          setOpenId(null);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openId, onClose]);

  /* ── focus trap + scroll lock ── */
  useEffect(() => {
    const overlay = overlayRef.current;
    overlay?.querySelector<HTMLButtonElement>("[data-news-close]")?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="news-archive"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="寻访新闻稿档案"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <header className="news-archive__header">
        <div>
          <span className="news-archive__eyebrow">PRESS · ARCHIVE</span>
          <h2>寻访新闻稿档案</h2>
          <p>按寻访地点归档的团队新闻稿，点击档案袋查看全文。</p>
        </div>
        <button
          type="button"
          className="news-archive__close"
          data-news-close
          aria-label="关闭新闻稿档案"
          onClick={onClose}
        >
          <span aria-hidden="true">✕</span>
          关闭
        </button>
      </header>

      <div className="news-archive__body">
        {/* ── 档案袋列表 ── */}
        <div className="news-archive__shelves" aria-label="档案袋列表">
          {newsArchive.map((record) => {
            const isOpen = record.id === openId;
            return (
              <button
                type="button"
                key={record.id}
                className="news-archive__pocket"
                data-open={isOpen}
                onClick={() => setOpenId(isOpen ? null : record.id)}
                aria-expanded={isOpen}
              >
                <span className="news-archive__pocket-tab" aria-hidden="true" />
                <span className="news-archive__pocket-top" aria-hidden="true" />
                <span className="news-archive__pocket-body">
                  <span className="news-archive__pocket-meta">
                    {record.routeLabel} · {record.date}
                  </span>
                  <strong>{record.title}</strong>
                  <small>{isOpen ? "收起档案袋" : "打开档案袋"} →
                  </small>
                </span>
              </button>
            );
          })}
        </div>

        {/* ── 展开的新闻稿全文 ── */}
        {openRecord && (
          <article className="news-archive__paper" key={openRecord.id}>
            <header>
              <span>
                {openRecord.routeLabel} · {openRecord.date}
              </span>
              <h3>{openRecord.title}</h3>
            </header>
            <div className="news-archive__paper-body">
              {openRecord.content.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>
        )}
      </div>

      <footer className="news-archive__footer">
        <span>
          已归档 {newsArchive.length} 份新闻稿 · 持续更新中
        </span>
      </footer>
    </div>
  );
}
