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
import { SiteFooter, SiteHeader } from "./shared";

const practiceSteps = [
  {
    id: "visit",
    title: "寻访",
    action: "进入史迹现场，沿已确认日程完成观察与走访。",
    evidence: "地点与日程确认清单",
  },
  {
    id: "capture",
    title: "采集",
    action: "用影像、访谈、全景和笔记保存现场材料。",
    evidence: "固定素材清单",
  },
  {
    id: "decode",
    title: "解码",
    action: "整理地点、来源与实践记录，建立可追溯档案。",
    evidence: "字段级来源",
  },
  {
    id: "publish",
    title: "传播",
    action: "将核验后的内容转化为展厅、影片与报告。",
    evidence: "公开状态门禁",
  },
] as const;

const heroSubtitleBreakIndex = 4;

export default function Home() {
  const { routeCount, siteCount } = getProjectCounts();
  const outcomes = getOrderedOutcomes();
  const heroAsset = getRequiredAssetById("field-05");

  return (
    <main className="home-page">
      <SiteHeader />

      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero__stage">
          <div className="home-hero__copy">
            <p className="home-hero__project">北京科技大学社会实践 · 2026</p>
            <h1 id="home-title">
              <span>{project.title.value}</span>
              <strong>
                {project.subtitle.value.slice(0, heroSubtitleBreakIndex)}
                <br />
                {project.subtitle.value.slice(heroSubtitleBreakIndex)}
              </strong>
            </h1>
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

          <div className="home-hero__visual">
            <AssetMedia asset={heroAsset} priority sizes="(min-width: 900px) 58vw, 100vw" />
            <p className="home-hero__statement">
              以脚步丈量历史
              <span aria-hidden="true">·</span>
              以技术保存记忆
            </p>
          </div>
        </div>

        <EvidenceStrip
          label="项目证据概览"
          fields={[
            { label: "实践周期", value: `${project.durationDays.value} 天` },
            { label: "主题路线", value: `${routeCount} 条` },
            { label: "史迹坐标", value: `${siteCount} 处` },
            { label: "记录方式", value: "影像 · 访谈 · 全景 · 资料整理" },
          ]}
        />
      </section>

      <section className="home-method" id="practice-method" aria-labelledby="method-title">
        <header className="home-method__intro">
          <p>实践不是一次参观，而是一条有证据的工作链。</p>
          <div>
            <h2 id="method-title">从现场出发，让材料经过核验后再被看见。</h2>
            <p>
              每一步都有明确动作与对应证据。尚未完成的内容保持筹备状态，
              不用推断或生成内容填补空白。
            </p>
          </div>
        </header>

        <ol className="home-method__steps">
          {practiceSteps.map((step, index) => (
            <li key={step.id}>
              <span className="home-method__number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{step.title}</h3>
              <p>{step.action}</p>
              <small>{step.evidence}</small>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-routes" aria-labelledby="routes-title">
        <header className="home-section-heading home-section-heading--dark">
          <p>三条路线构成实践的叙事骨架</p>
          <h2 id="routes-title">沿坐标进入北京革命史迹现场</h2>
          <a href={withBasePath("/journey")}>浏览完整路线 →</a>
        </header>

        <div className="home-route-list">
          {routes.map((route, index) => {
            const routeSites = getSitesForRoute(route.id);
            const routeAsset = getRequiredAssetById(route.heroAssetId);
            const representativeSites = routeSites.slice(0, 3);

            return (
              <article className="home-route" key={route.id}>
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
        <header className="home-section-heading">
          <p>成果是否可访问，由真实交付状态决定</p>
          <h2 id="outcomes-title">四项成果，公开状态清楚可见</h2>
          <a href={withBasePath("/outcomes")}>查看成果状态 →</a>
        </header>

        <div className="home-outcomes__list">
          {outcomes.map((outcome) => (
            <article key={outcome.id}>
              <span className="home-outcomes__order">
                {String(outcome.order).padStart(2, "0")}
              </span>
              <div>
                <h3>{outcome.title.value}</h3>
                <p>{outcome.description[0].text}</p>
              </div>
              <StatusBadge status={outcome.publicationStatus} />
              <p className="home-outcomes__condition">
                {outcome.completionStatus === "complete"
                  ? "已达到公开交付条件"
                  : outcome.deliveryCondition}
              </p>
            </article>
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
