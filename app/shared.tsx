export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="identity" href="/walking-coordinates/">
        <span className="identity-mark">北科</span>
        <span><strong>北京科技大学</strong><small>社会实践成果展 · 2026</small></span>
      </a>
      <nav>
        <a href="/walking-coordinates/">首页</a>
        <a href="/walking-coordinates/journey">寻访路线</a>
        <a href="/walking-coordinates/outcomes">数字成果</a>
        <a href="/walking-coordinates/legacy">精神传承</a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer>
      <a className="identity" href="/walking-coordinates/"><span className="identity-mark">北科</span><span><strong>传承红色基因</strong><small>革命史迹数字化寻访</small></span></a>
      <p>北京科技大学马克思主义学院 · 2026 年社会实践成果展示</p>
      <a href="/walking-coordinates/">回到首页 ↑</a>
    </footer>
  );
}
