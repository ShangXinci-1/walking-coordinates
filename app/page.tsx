import { SiteHeader, SiteFooter } from "./shared";

const BASE = "/walking-coordinates";

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <section className="hero" id="top">
        <div className="hero-deco" aria-hidden="true">
          <span className="hero-deco-circle c1" /><span className="hero-deco-circle c2" />
          <span className="hero-deco-circle c3" />
          <span className="hero-deco-dot d1" /><span className="hero-deco-dot d2" />
          <span className="hero-deco-dot d3" /><span className="hero-deco-dot d4" />
          <span className="hero-deco-dot d5" />
        </div>
        <div className="hero-copy">
          <p className="hero-kicker">传承红色基因</p>
          <h1>革命史迹<br />数字化寻访</h1>
          <p className="hero-lead">我们把行走变成坐标，把史迹转译为可抵达、可阅读、可传承的数字记忆。</p>
          <div className="hero-stats"><span><b>14</b>天系统实践</span><i>/</i><span><b>3</b>条北京路线</span></div>
          <a className="primary-link" href={`${BASE}/journey`}>探索寻访路线 <span>↘</span></a>
        </div>
        <div className="hero-photos">
          <figure className="hero-photo hero-photo-main"><img src={`${BASE}/images/field-05.svg`} alt="合影" /><figcaption>FIELD RECORD / 01</figcaption></figure>
          <figure className="hero-photo hero-photo-side"><img src={`${BASE}/images/field-03.svg`} alt="社区传播" /><figcaption>FIELD RECORD / 02</figcaption></figure>
          <blockquote>以脚步丈量历史，<br /><em>以技术保存记忆</em></blockquote>
        </div>
        <div className="route-lines"><span className="line line-a" /><span className="line line-b" /><span className="line line-c" /><i className="point point-a" /><i className="point point-b" /><i className="point point-c" /></div>
        <div className="hero-footer">
          <a href={`${BASE}/outcomes`}><span>→</span><small>核心成果入口</small><strong>北京红色史迹数字线上展厅</strong></a>
          <span><small>ARCHIVE</small><strong>数字档案</strong></span><span><small>FILM</small><strong>主题微电影</strong></span><span><small>REPORT</small><strong>实践调研报告</strong></span>
        </div>
      </section>

      <section className="manifesto">
        <p>这不是一次旁观式参访。</p>
        <h2>从现场出发，<br />让历史在数字空间继续发生。</h2>
        <div><p>项目聚焦北京核心红色史迹，以"实地深度寻访 + 数字化技术采集 + 青年化叙事转化"为方法，建立从寻访、解码到传播的完整实践链。</p></div>
      </section>

      <section className="entry-section">
        <div className="section-heading"><p>探索</p><h2>三大核心板块</h2></div>
        <div className="entry-cards">
          <a href={`${BASE}/journey`} className="entry-card">
            <span className="entry-icon">🗺️</span>
            <span className="entry-number">01</span>
            <h3>寻访路线</h3>
            <p>三条北京红色路线，以脚步丈量革命史迹。</p>
            <span className="entry-arrow">进入探索 <span>→</span></span>
          </a>
          <a href={`${BASE}/outcomes`} className="entry-card">
            <span className="entry-icon">🏛️</span>
            <span className="entry-number">02</span>
            <h3>数字成果</h3>
            <p>线上展厅、数字档案、微电影与调研报告。</p>
            <span className="entry-arrow">查看成果 <span>→</span></span>
          </a>
          <a href={`${BASE}/legacy`} className="entry-card">
            <span className="entry-icon">🔥</span>
            <span className="entry-number">03</span>
            <h3>精神传承</h3>
            <p>让红色精神转化为可践行的行动力量。</p>
            <span className="entry-arrow">感受传承 <span>→</span></span>
          </a>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
