import { routes } from "../data/routes";
import "../styles/pages/home.css";
import { AssetMedia, StatusBadge } from "../components";
import {
  getOrderedOutcomes,
  getRequiredAssetById,
  getSitesForRoute,
} from "../lib/content/selectors";
import { withBasePath } from "../lib/site";
import GradientText from "../components/GradientText";
import NexumHero from "../components/NexumHero";
import { RevealOnScroll } from "../components/RevealOnScroll";
import { StaggerContainer } from "../components/StaggerContainer";
import { OutcomeShowcaseCard } from "../components/home/OutcomeShowcaseCard";
import LightPillar from "../components/LightPillar";
import { SiteFooter, SiteHeader } from "./shared";
import "../styles/components/hero-nexum.css";

const practiceSteps = [
  {
    id: "visit",
    title: "寻访",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    action:
      "进入史迹现场，沿已确认日程完成观察与走访。队员在讲解员带领下走进北大红楼、京报馆、李大钊故居等十三处革命史迹，携带相机与笔记本，逐站核对地点坐标、建筑风貌与展陈内容，为后续记录建立现场参照。",
    points: [
      "沿三条路线进入十三处革命史迹现场",
      "讲解员带领下完成逐站观察与走访",
      "核对坐标、建筑风貌与展陈内容",
    ],
    evidence: "地点与日程确认清单",
  },
  {
    id: "capture",
    title: "采集",
    icon: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z",
    action:
      "用影像、访谈、全景和笔记保存现场材料。团队使用单反与全景相机完成高清拍摄，围绕展陈细节、建筑结构与人物交流分角度记录；同时对讲解员与社区居民开展访谈，采集口述史料与环境声音，让每一处现场都以多种媒介留存。",
    points: [
      "单反与全景相机完成高清影像记录",
      "围绕展陈、建筑与人物多角度采集",
      "访谈口述史料与环境声音并存档",
    ],
    evidence: "固定素材清单",
  },
  {
    id: "decode",
    title: "解码",
    icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M2 9h20 M9 13h6",
    action:
      "整理地点、来源与实践记录，建立可追溯档案。影像按地点归档，访谈转写为文字，资料注明来源；每条记录与现场记录表对应，经过人工复核后写入数字档案，确保每一段历史叙述都有据可查、有源可溯。",
    points: [
      "影像按地点归档、访谈转写为文字",
      "每条记录与现场记录表一一对应",
      "人工复核后写入可追溯数字档案",
    ],
    evidence: "字段级来源",
  },
  {
    id: "publish",
    title: "传播",
    icon: "M4 4v4 M4 8a8 8 0 0 0 16 0 M4 16v4 M12 4v16",
    action:
      "将核验后的内容转化为展厅、影片与报告。线上展厅按路线组织十三处 VR 全景，微电影以寻访现场为素材剪辑，调研报告沉淀方法路径；社区宣讲则把故事带回居民身边，让红色记忆在一次次抵达中被重新听见。",
    points: [
      "线上展厅组织十三处 VR 全景现场",
      "微电影与调研报告沉淀方法路径",
      "社区宣讲让故事回到居民身边",
    ],
    evidence: "公开状态门禁",
  },
] as const;

const heroSubtitleBreakIndex = 4;

export default function Home() {
  const outcomes = getOrderedOutcomes();

  return (
    <main className="home-page">
      <SiteHeader />

      {/* ── 首屏：全屏视频英雄区（nexum 风格实验版） ── */}
      <NexumHero />

      <section className="home-method" id="practice-method" aria-labelledby="method-title">
        <RevealOnScroll blur>
          <header className="home-method__intro">
            <p>实践不是一次参观，而是一条有证据的工作链。</p>
            <div>
              <h2 id="method-title">从现场出发，让材料经过核验后再被看见。</h2>
              <p>
                从寻访、采集、解码到传播，每一步都有清晰的动作与产出。
                团队以影像、访谈、全景和笔记保存现场，
                让历史在数字空间继续发生。
              </p>
            </div>
          </header>
        </RevealOnScroll>

        <RevealOnScroll blur>
        <div className="home-method__steps">
          {practiceSteps.map((step, index) => (
            <article
              className="home-method__flip"
              key={step.id}
              tabIndex={0}
              aria-label={`${step.title}：${step.action}`}
            >
              <div className="home-method__flip-inner">
                {/* 正面：图标 + 步骤名 */}
                <div className="home-method__flip-face home-method__flip-front">
                  <span className="home-method__flip-glow" aria-hidden="true" />
                  <span
                    className="home-method__flip-glow home-method__flip-glow--b"
                    aria-hidden="true"
                  />
                  <span className="home-method__flip-top">
                    <span className="home-method__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d={step.icon} />
                      </svg>
                    </span>
                    <span className="home-method__number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <span className="home-method__flip-title">
                    <h3>{step.title}</h3>
                    <span className="home-method__flip-hint">
                      悬停翻面
                      <span aria-hidden="true">↻</span>
                    </span>
                  </span>
                </div>
                {/* 背面：完整动作 + 要点 + 档案来源 */}
                <div className="home-method__flip-face home-method__flip-back">
                  <i className="home-method__flip-spin" aria-hidden="true" />
                  <div className="home-method__flip-panel">
                    <h3>{step.title}</h3>
                    <p className="home-method__action">{step.action}</p>
                    <ul className="home-method__points">
                      {step.points.map((point) => (
                        <li key={point}>
                          <i aria-hidden="true" />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <span className="home-method__flip-evidence">
                      <i aria-hidden="true" />
                      {step.evidence}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        </RevealOnScroll>
      </section>

      <section className="home-routes" aria-labelledby="routes-title">
        <RevealOnScroll parallax={40}>
          <header className="home-section-heading home-section-heading--dark">
            <p className="home-section-heading__kicker">三条路线构成实践的叙事骨架</p>
            <div className="home-section-heading__title">
              <GradientText
                colors={["#E3A94C", "#D93E2D", "#F2E8D5", "#E3A94C"]}
                animationSpeed={5}
                showBorder={false}
                className="home-heading-gradient"
              >
                沿坐标进入 北京革命史迹现场
              </GradientText>
            </div>
            <a className="home-section-heading__link" href={withBasePath("/journey")}>
              浏览完整路线 <span aria-hidden="true">→</span>
            </a>
          </header>
        </RevealOnScroll>

        <StaggerContainer className="home-route-list">
          {routes.map((route, index) => {
            const routeSites = getSitesForRoute(route.id);
            const routeAsset = getRequiredAssetById(route.heroAssetId);
            const representativeSites = routeSites.slice(0, 3);

            return (
              <article
                className="home-route"
                key={route.id}
                data-code={route.code}
                style={{ "--i": index } as React.CSSProperties}
              >
                <div className="home-route__visual">
                  <AssetMedia
                    asset={routeAsset}
                    sizes="(min-width: 900px) 55vw, 100vw"
                  />
                </div>
                <div className="home-route__copy">
                  <p className="home-route__chapter">
                    路线 {route.code} · {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3>{route.title.value}</h3>
                  <p className="home-route__summary">{route.summary[0].text}</p>
                  <dl>
                    <div>
                      <dt>实践日程</dt>
                      <dd>{route.dayRange.value}</dd>
                    </div>
                    <div>
                      <dt>地点数量</dt>
                      <dd>{routeSites.length} 处</dd>
                    </div>
                    <div>
                      <dt>覆盖区域</dt>
                      <dd>{route.coordinateRegion}</dd>
                    </div>
                  </dl>
                  <div className="home-route__sites" aria-label={`${route.title.value}代表地点`}>
                    {representativeSites.map((site) => (
                      <span key={site.id}>{site.name.value}</span>
                    ))}
                  </div>
                  <a href={withBasePath("/journey")}>
                    进入{route.title.value}
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            );
          })}
        </StaggerContainer>
      </section>

      <section className="home-outcomes" aria-labelledby="outcomes-title">
        {/* 背景装饰：红金光柱（React Bits LightPillar，Three.js 光线柱） */}
        <LightPillar
          topColor="#E3A94C"
          bottomColor="#B02318"
          intensity={0.7}
          rotationSpeed={0.22}
          glowAmount={0.016}
          pillarWidth={5.2}
          pillarHeight={0.9}
          noiseIntensity={0.3}
          mixBlendMode="multiply"
          quality="high"
        />

        <RevealOnScroll parallax={40}>
          <header className="home-section-heading">
            <p>从现场采集到数字呈现，成果逐步成形</p>
            <h2 id="outcomes-title">寻访之后，留下了什么</h2>
            <a href={withBasePath("/outcomes")}>查看全部成果 →</a>
          </header>
        </RevealOnScroll>

        <StaggerContainer className="home-outcomes__showcase">
          {outcomes.map((outcome, index) => (
            <OutcomeShowcaseCard
              outcome={outcome}
              index={index}
              key={outcome.id}
            />
          ))}
        </StaggerContainer>
      </section>

      <section className="home-closing" aria-labelledby="closing-title">
        <RevealOnScroll blur>
          <p>下一站，由路线与证据共同指向。</p>
          <h2 id="closing-title">
            <span className="home-closing__h1-line">从一个坐标开始，</span>
            <span className="home-closing__h1-line">读懂一段仍在被传承的历史。</span>
          </h2>
          <div>
            <a className="home-action home-action--light" href={withBasePath("/journey")}>
              浏览完整路线
              <span aria-hidden="true">→</span>
            </a>
            <a className="home-action home-action--quiet-light" href={withBasePath("/outcomes")}>
              查看成果状态
            </a>
          </div>
        </RevealOnScroll>
      </section>

      <SiteFooter />
    </main>
  );
}
