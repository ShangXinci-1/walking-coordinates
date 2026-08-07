// NexumHero：全屏视频英雄区（nexum 风格实验版）
// 视频背景 + 玻璃拟态卡片 + 底部锚定内容；无交互状态，纯展示。
import { withBasePath } from "../lib/site";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4";

export default function NexumHero() {
  return (
    <section className="nexum-hero" aria-labelledby="nexum-title">
      {/* ── 全屏背景视频（poster 兜底：视频未加载时显示实地照片） ── */}
      <video
        className="nexum-hero__video"
        autoPlay
        loop
        muted
        playsInline
        poster={withBasePath("/media/xiangshan/背影3.0.jpg")}
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

      <div className="nexum-hero__content">
        {/* ── 左：主标题 + CTA ── */}
        <div className="nexum-hero__left">
          <h1 id="nexum-title">
            Ship AI workers that grind while you rest
          </h1>
          <div className="nexum-hero__cta">
            <input
              type="email"
              placeholder="Type your email"
              aria-label="Type your email"
            />
            <button type="button" className="nexum-hero__cta-btn">
              Get started
            </button>
          </div>
        </div>

        {/* ── 右：两张玻璃卡片 ── */}
        <div className="nexum-hero__cards">
          <div className="nexum-hero__card nexum-hero__card--stats">
            <div className="nexum-hero__stat">42,500+</div>
            <p>Teams run Nexum to handle recurring ops daily.</p>
          </div>
          <div className="nexum-hero__card nexum-hero__card--quote">
            <div className="nexum-hero__quote-head">
              <span className="nexum-hero__quote-badge" aria-hidden="true">
                S
              </span>
              <span className="nexum-hero__quote-brand">Stratify</span>
            </div>
            <p className="nexum-hero__quote-text">
              “With Nexum we went from managing tedious operational work to
              having AI agents that handle everything.”
            </p>
            <div className="nexum-hero__quote-foot">
              <img
                className="nexum-hero__quote-avatar"
                src="https://i.pravatar.cc/72?img=12"
                alt="Sara Klein"
                width={36}
                height={36}
              />
              <div className="nexum-hero__quote-meta">
                <strong>Sara Klein</strong>
                <span>Dir of Operations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
