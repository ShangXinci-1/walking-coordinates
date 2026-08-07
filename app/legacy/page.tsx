import type { Metadata } from "next";
import { AssetMedia } from "../../components";
import AccordionGallery from "../../components/AccordionGallery";
import { getRequiredAssetById } from "../../lib/content/selectors";
import { withBasePath } from "../../lib/site";
import { SiteFooter, SiteHeader } from "../shared";

export const metadata: Metadata = {
  title: "精神传承",
  description: "记录青年实践团队走进社区开展红色文化宣讲的现场与成果。",
};

const communityAssets = Array.from(
  { length: 14 },
  (_, i) => `community-${String(i + 1).padStart(2, "0")}`,
);

const domeImages = communityAssets.map((assetId) => {
  const asset = getRequiredAssetById(assetId);
  const src =
    asset.assetStatus === "ready"
      ? (asset as { finalSrc: string }).finalSrc
      : (asset as { placeholderSrc: string }).placeholderSrc;
  return { src, alt: "社区宣讲现场" };
});

const interviewPoints = [
  {
    title: "史实为根",
    text: "传播内容必须坚守史实绝对真实，严格甄别史料来源。网络自媒体、小众视频号、个人公众号容易为博取流量篡改、夸大甚至虚构红色历史，数字化微电影、线上展馆、短视频创作必须规避这类失真素材，选用的史料要有明确发生时间、史实无争议。地域史料可信度存在明显差异：北京本地红色景点、纪念馆史料经过权威考证，争议内容极少，调研取材风险低；部分偏远地区红色资源研究起步较晚，展馆宣传材料可能存在史料争议，收集素材时需要多方核对、谨慎使用。",
  },
  {
    title: "技术为器",
    text: "VR 全景、线上展厅、短视频、微电影、专题网站等数字化载体只是传播工具，核心目标是传递红色文化精神内核。创作中不能一味追求炫酷技术特效，把视觉与交互技术当成核心，忽略红色故事与革命精神本身——技术必须服务于红色内容表达。同时要平衡传播趣味性与历史严肃性：允许通过完整故事叙事、沉浸式场景、互动交互降低说教感，但严格禁止恶搞革命人物、过度渲染、虚构历史情节，判断尺度是“助力理解历史”而非单纯娱乐大众。",
  },
  {
    title: "青年为桥",
    text: "红色文化教育主阵地集中于高校，依靠思政课堂与党团活动完成基础教育，但红色文化的作用能够持续延伸至毕业后的工作、学术研究与社会责任担当。结合院校特色落地红色精神，可以形成行业专属精神资源——以钢铁院校为例，1956 年大炼钢铁时期的红色历史与奋斗精神，能成为毕业生职业发展的精神根基。青年还应发挥数字化创作优势，选取单一文物、旧址片段深挖史料，以动漫、专题短片等小而精的形式打造差异化数字产品，让红色基因在新时代浪潮中焕发光彩。",
  },
];

export default function LegacyPage() {
  const heroAsset = getRequiredAssetById("community-01");

  return (
    <main className="legacy-page">
      <SiteHeader />

      {/* ── Hero：社区宣讲 ── */}
      <section className="legacy-hero" aria-labelledby="legacy-title">
        <div className="legacy-hero__media">
          <AssetMedia
            asset={heroAsset}
            priority
            sizes="(min-width: 980px) 46vw, 100vw"
          />
          <div className="legacy-hero__badge">社区宣讲 · 2026-08-04</div>
        </div>
        <div className="legacy-hero__copy">
          <p>寻访之后，故事走进社区</p>
          <h1 id="legacy-title">
            让红色记忆
            <br />
            走进社区生活
          </h1>
          <p className="legacy-hero__lead">
            实践团队走进社区，把寻访途中采集的影像与故事带到居民身边。
            宣讲不止于讲述，更在与居民的交流中，让红色精神重新被听见。
          </p>
        </div>
      </section>

      {/* ── 宣讲现场：照片墙 ── */}
      <section className="legacy-community" aria-labelledby="community-title">
        <header className="legacy-section-heading">
          <p>宣讲现场</p>
          <div>
            <h2 id="community-title">镜头里的社区传播时刻</h2>
            <p>
              队员展示寻访影像、讲解革命故事，与社区居民围坐交流——
              每一个现场，都是红色记忆的一次重新抵达。
            </p>
          </div>
        </header>

        <div className="legacy-community__dome">
          <AccordionGallery
            items={domeImages.map((img, i) => ({
              image: withBasePath(img.src),
              label: `现场 ${String(i + 1).padStart(2, "0")}`,
              alt: img.alt,
            }))}
            defaultIndex={2}
            expandRatio={0.5}
            trigger="hover"
            height={440}
            radius={14}
            grayscale={false}
            accentColor="#D4AF37"
            overlayColor="#120f17"
            textColor="#F8FAFC"
          />
        </div>
      </section>

      {/* ── 访谈观点 ── */}
      <section className="legacy-voice" aria-labelledby="voice-title">
        <header className="legacy-section-heading legacy-section-heading--light">
          <p>调研访谈</p>
          <div>
            <h2 id="voice-title">关于红色文化数字化传播，我们听到了什么</h2>
            <p>
              团队围绕红色文化数字化传承开展深度访谈，从价值内涵、传播底线到数字产品创作，形成三点核心共识。
            </p>
          </div>
        </header>

        <div className="legacy-voice__list">
          {interviewPoints.map((point, index) => (
            <article className="legacy-voice__item" key={point.title}>
              <span className="legacy-voice__number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 结尾行动 ── */}
      <section className="legacy-closing" aria-labelledby="legacy-closing-title">
        <div className="legacy-closing__copy">
          <p>传播没有终点</p>
          <h2 id="legacy-closing-title">
            从寻访到宣讲，
            <br />
            红色基因在一次次抵达中延续。
          </h2>
          <div>
            <a href={withBasePath("/journey")}>
              浏览完整路线 <span aria-hidden="true">→</span>
            </a>
            <a href={withBasePath("/outcomes")}>
              查看成果状态 <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
