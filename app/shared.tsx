import { project } from "../data/project";
import { withBasePath } from "../lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="header-logo" href={withBasePath("/")}>
          <span className="logo-mark">北科</span>
          <span className="logo-text">
            <strong>{project.title.value}</strong>
            <small>{project.subtitle.value}</small>
          </span>
        </a>
        <nav className="header-nav">
          <a href={withBasePath("/")}>首页</a>
          <a href={withBasePath("/journey")}>寻访路线</a>
          <a href={withBasePath("/outcomes")}>数字成果</a>
          <a href={withBasePath("/legacy")}>精神传承</a>
        </nav>
        <div className="header-extra">
          <span className="header-year">2026</span>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <a className="identity" href={withBasePath("/")}><span className="identity-mark">北科</span><span><strong>传承红色基因</strong><small>{project.subtitle.value}</small></span></a>
      <p>北京科技大学马克思主义学院 · 2026 年社会实践成果展示</p>
      <a href={withBasePath("/")}>回到首页 ↑</a>
    </footer>
  );
}
