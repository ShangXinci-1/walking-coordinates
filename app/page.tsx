import { routes } from "../data/routes";
import "../styles/pages/home.css";
import {
  AssetMedia,
  EvidenceStrip,
  StatusBadge,
} from "../components";
import {
  getOrderedOutcomes,
  getProjectCounts,
  getRequiredAssetById,
  getSitesForRoute,
} from "../lib/content/selectors";
import { withBasePath } from "../lib/site";
import { project } from "../data/project";
import StrokeText from "../components/StrokeText";
import { RevealOnScroll } from "../components/RevealOnScroll";
import HomeMotion from "../components/HomeMotion";
import TiltCards from "../components/TiltCards";
import { SiteFooter, SiteHeader } from "./shared";

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
  const { routeCount, siteCount } = getProjectCounts();
  const outcomes = getOrderedOutcomes();
  const heroAsset = getRequiredAssetById("field-05");
  const heroSrc =
    heroAsset.assetStatus === "ready"
      ? (heroAsset as { finalSrc: string }).finalSrc
      : (heroAsset as { placeholderSrc: string }).placeholderSrc;

  return (
    <main className="home-page">
      <SiteHeader />

      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__stage">
          <div className="home-hero__visual" data-parallax="10">
            <AssetMedia asset={heroAsset} priority sizes="100vw" />
          </div>

          <div className="home-hero__content">
            <p className="home-hero__project">北京科技大学社会实践 · 2026</p>
            <div className="home-hero__stroke">
              <StrokeText
                text="革命史迹 数字化寻访"
                strokeColor="#D4AF37"
                fillColor="#F8FAFC"
                strokeWidth={1.3}
                drawDuration={1.8}
                fillDelay={0.3}
                stagger={0.06}
                ease="power2.out"
                trigger="mount"
                fillMode="wipe"
                fontSize={150}
                fontWeight={900}
                letterSpacing={-2}
              />
            </div>
            <p className="home-hero__lead">
              北京科技大学青年实践团队沿三条路线走进十三处革命史迹，
              以影像、访谈、全景与资料整理建立可追溯的数字记录。
            </p>
            <div className="home-hero__actions">
              <a className="home-action home-action--primary" href={withBasePath("/journey")}>
                从路线开始
              </a>
              <a className="home-action home-action--quiet" href="#practice-method">
                查看项目方法
              </a>
            </div>
          </div>
        </div>

        <HomeMotion>
          <EvidenceStrip
            label="项目证据概览"
            fields={[
              { label: "实践周期", value: `${project.durationDays.value} 天` },
              { label: "主题路线", value: `${routeCount} 条` },
              { label: "史迹坐标", value: `${siteCount} 处` },
              { label: "记录方式", value: "影像 · 访谈 · 全景 · 资料整理" },
            ]}
          />
        </HomeMotion>
      </section>

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
        <ol className="home-method__steps">
          {practiceSteps.map((step, index) => (
            <li
              key={step.id}
              data-step={String(index + 1).padStart(2, "0")}
              className="home-method__card"
              data-tilt
            >
              <span className="home-method__shine" aria-hidden="true" />
              <div className="home-method__card-top">
                <span className="home-method__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={step.icon} />
                  </svg>
                </span>
                <span className="home-method__number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
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

            </li>
          ))}
        </ol>
        </RevealOnScroll>
        <TiltCards />
      </section>

      <section className="home-routes" aria-labelledby="routes-title">
        <RevealOnScroll parallax={40}>
          <header className="home-section-heading home-section-heading--dark">
            <p className="home-section-heading__kicker">三条路线构成实践的叙事骨架</p>
            <div className="home-section-heading__title">
              <StrokeText
                text="沿坐标进入 北京革命史迹现场"
                strokeColor="#D4AF37"
                fillColor="#F8FAFC"
                strokeWidth={1.2}
                drawDuration={1.4}
                fillDelay={0.25}
                stagger={0.05}
                ease="power2.out"
                trigger="scroll"
                fillMode="wipe"
                fontSize={150}
                fontWeight={900}
                letterSpacing={-3}
              />
            </div>
            <a className="home-section-heading__link" href={withBasePath("/journey")}>
              浏览完整路线 <span aria-hidden="true">→</span>
            </a>
          </header>
        </RevealOnScroll>

        <div className="home-route-list">
          {routes.map((route, index) => {
            const routeSites = getSitesForRoute(route.id);
            const routeAsset = getRequiredAssetById(route.heroAssetId);
            const representativeSites = routeSites.slice(0, 3);

            return (
              <article className="home-route" key={route.id} data-code={route.code}>
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
        </div>
      </section>

      <section className="home-outcomes" aria-labelledby="outcomes-title">
        <RevealOnScroll parallax={40}>
          <header className="home-section-heading">
            <p>从现场采集到数字呈现，成果逐步成形</p>
            <h2 id="outcomes-title">寻访之后，留下了什么</h2>
            <a href={withBasePath("/outcomes")}>查看全部成果 →</a>
          </header>
        </RevealOnScroll>

        <div className="home-outcomes__showcase">
          {outcomes.map((outcome, index) => (
            <a
              className="home-outcomes__card"
              href={withBasePath("/outcomes")}
              key={outcome.id}
            >
              <span className="home-outcomes__card-no">
                {String(outcome.order).padStart(2, "0")}
              </span>
              <div className="home-outcomes__card-body">
                <h3>{outcome.title.value}</h3>
                <p>{outcome.description[0].text}</p>
              </div>
              <span className="home-outcomes__card-arrow" aria-hidden="true">
                →
              </span>
              <i
                className="home-outcomes__card-glow"
                aria-hidden="true"
                style={{ "--i": index } as React.CSSProperties}
              />
            </a>
          ))}
        </div>
      </section>

      <section className="home-closing" aria-labelledby="closing-title">
        <p>下一站，由路线与证据共同指向。</p>
        <h2 id="closing-title">从一个坐标开始，读懂一段仍在被传承的历史。</h2>
        <div>
          <a className="home-action home-action--light" href={withBasePath("/journey")}>
            浏览完整路线
            <span aria-hidden="true">→</span>
          </a>
          <a className="home-action home-action--quiet-light" href={withBasePath("/outcomes")}>
            查看成果状态
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
