"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { project } from "../data/project";
import { withBasePath } from "../lib/site";

const navigation = [
  { href: "/", label: "首页" },
  { href: "/journey", label: "寻访路线" },
  { href: "/outcomes", label: "数字成果" },
  { href: "/legacy", label: "精神传承" },
] as const;

function normalizePathname(pathname: string) {
  const withoutBasePath = pathname.replace(/^\/walking-coordinates/, "");
  return withoutBasePath === "" ? "/" : withoutBasePath;
}

function isCurrentPath(currentPath: string, href: string) {
  return href === "/"
    ? currentPath === "/"
    : currentPath === href || currentPath.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = normalizePathname(usePathname());
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 12);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="global-header" data-scrolled={scrolled}>
      <div className="global-header__inner">
        <a
          className="global-header__logo"
          href={withBasePath("/")}
        >
          <span className="global-header__mark" aria-hidden="true">
            <img
              className="global-header__badge"
              src={withBasePath("/images/team-badge.png")}
              alt=""
              width={38}
              height={38}
            />
          </span>
          <span className="global-header__wordmark">
            <strong>{project.title.value}</strong>
            <small>{project.subtitle.value}</small>
          </span>
        </a>

        <nav className="global-nav" aria-label="主导航">
          {navigation.map((item) => {
            const current = isCurrentPath(pathname, item.href);
            return (
              <a
                className="global-nav__link"
                href={withBasePath(item.href)}
                aria-current={current ? "page" : undefined}
                key={item.href}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <span className="global-header__year" aria-label="项目年份 2026">
          2026
        </span>

        <button
          className="global-header__menu-button"
          type="button"
          aria-label={menuOpen ? "关闭主导航" : "打开主导航"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="global-header__menu-icon" aria-hidden="true" />
        </button>
      </div>

      {menuOpen && (
        <nav
          className="mobile-nav"
          id="mobile-navigation"
          aria-label="移动端主导航"
        >
          <div className="mobile-nav__inner">
            {navigation.map((item) => {
              const current = isCurrentPath(pathname, item.href);
              return (
                <a
                  className="mobile-nav__link"
                  href={withBasePath(item.href)}
                  aria-current={current ? "page" : undefined}
                  key={item.href}
                >
                  {item.label}
                </a>
              );
            })}
            <a
              className="mobile-nav__shortcut"
              href={withBasePath("/journey")}
            >
              查看三条路线 <span aria-hidden="true">→</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="global-footer">
      <a className="global-footer__identity" href={withBasePath("/")}>
        <span className="global-footer__mark">北科</span>
        <span className="global-footer__wordmark">
          <strong>传承红色基因</strong>
          <small>{project.subtitle.value}</small>
        </span>
      </a>
      <p>北京科技大学马克思主义学院 · 2026 年社会实践成果展示</p>
      <a className="global-footer__home" href={withBasePath("/")}>
        回到首页 ↑
      </a>
    </footer>
  );
}
