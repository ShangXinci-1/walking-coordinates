import {
  getAssetSrc,
  getRequiredAssetById,
} from "../../lib/content/selectors";
import { SiteHeader, SiteFooter } from "../shared";

export default function LegacyPage() {
  const legacyAsset = getRequiredAssetById("placeholder-field-03");

  return (
    <main>
      <SiteHeader />
      <section className="page-hero" style={{background:"linear-gradient(135deg, #6B0000 0%, #3a0000 50%, #1a0000 100%)"}}>
        <div className="page-hero-inner">
          <div className="page-hero-text" style={{maxWidth:"100%"}}>
            <div className="page-hero-watermark">LEGACY</div>
            <span className="page-hero-badge">SPIRIT & LEGACY</span>
            <h1>我们不是历史的访客<br />而是故事的转译者</h1>
            <p className="page-hero-summary">当青年走进革命旧址、聆听真实讲述，再用熟悉的媒介重新表达，红色精神便转化为可践行的行动力量。</p>
            <div className="page-hero-meta">
              <span>🔥 精神传承</span>
              <span>📖 青年表达</span>
              <span>🌟 行动力量</span>
            </div>
          </div>
          <div className="page-hero-visual"><img src={getAssetSrc(legacyAsset)} alt={legacyAsset.alt} /></div>
        </div>
      </section>

      <section className="legacy">
        <div className="legacy-photo"><img src={getAssetSrc(legacyAsset)} alt={legacyAsset.alt} /></div>
        <div><p>精神传承</p><h2>我们不是历史的访客，<br />而是故事的转译者。</h2><p>当青年走进革命旧址、聆听真实讲述，再用熟悉的媒介重新表达，红色精神便不再停留在书页上，而成为可以被理解、被分享、被继续践行的行动力量。</p><blockquote>让沉睡于京华大地的红色记忆重新醒来，永远鲜活。</blockquote></div>
      </section>
      <SiteFooter />
    </main>
  );
}
