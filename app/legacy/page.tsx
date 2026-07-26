import { SiteHeader, SiteFooter } from "../shared";

const BASE = "/walking-coordinates";

export default function LegacyPage() {
  return (
    <main>
      <SiteHeader />
      <section className="hero" style={{minHeight:"auto",height:"auto",padding:"60px clamp(24px,4vw,64px)"}}>
        <div className="hero-copy" style={{width:"100%"}}>
          <p className="hero-kicker">精神传承</p>
          <h1>我们不是历史的访客<br />而是故事的转译者</h1>
        </div>
      </section>

      <section className="legacy">
        <div className="legacy-photo"><img src={`${BASE}/images/field-03.svg`} alt="实践队员在社区开展红色文化交流活动" /></div>
        <div><p>精神传承</p><h2>我们不是历史的访客，<br />而是故事的转译者。</h2><p>当青年走进革命旧址、聆听真实讲述，再用熟悉的媒介重新表达，红色精神便不再停留在书页上，而成为可以被理解、被分享、被继续践行的行动力量。</p><blockquote>让沉睡于京华大地的红色记忆重新醒来，永远鲜活。</blockquote></div>
      </section>
      <SiteFooter />
    </main>
  );
}
