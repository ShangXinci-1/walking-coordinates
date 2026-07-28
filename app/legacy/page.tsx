import type { Metadata } from "next";
import { AssetMedia, StatusBadge } from "../../components";
import {
  getLegacyQuote,
  getOrderedLegacyImpacts,
  getOrderedLegacyTimeline,
  getRequiredAssetById,
} from "../../lib/content/selectors";
import { withBasePath } from "../../lib/site";
import { SiteFooter, SiteHeader } from "../shared";

export const metadata: Metadata = {
  title: "精神传承",
  description:
    "查看实践项目的人物记录、行动结果、影响证据与后续行动状态。",
};

export default function LegacyPage() {
  const quote = getLegacyQuote();
  const impacts = getOrderedLegacyImpacts();
  const timeline = getOrderedLegacyTimeline();
  const portraitAsset = getRequiredAssetById("placeholder-legacy-01");
  const actionAsset = getRequiredAssetById("placeholder-legacy-02");
  const evidenceAsset = getRequiredAssetById("placeholder-legacy-03");
  const closingAsset = getRequiredAssetById("placeholder-legacy-04");

  return (
    <main className="legacy-page">
      <SiteHeader />

      <section className="legacy-hero" aria-labelledby="legacy-title">
        <div className="legacy-hero__media">
          <AssetMedia
            asset={portraitAsset}
            priority
            sizes="(min-width: 980px) 42vw, 100vw"
          />
        </div>

        <div className="legacy-hero__copy">
          <p>人物、行动与影响，都需要证据</p>
          <h1 id="legacy-title">寻访之后，什么真正留了下来？</h1>
          <p className="legacy-hero__lead">
            传承不是一句结语。人物原话需要访谈记录，行动结果需要现场材料，
            影响判断需要可以追溯的使用与反馈证据。
          </p>

          <section
            className="legacy-quote-gate"
            aria-labelledby="legacy-quote-title"
          >
            <StatusBadge status={quote.publicationStatus} />
            <h2 id="legacy-quote-title">
              {quote.status === "missing"
                ? quote.placeholder.value
                : `“${quote.quote.value}”`}
            </h2>
            <p>
              {quote.status === "missing"
                ? quote.evidenceRequirement
                : `${quote.speaker.value} · ${quote.context.value}`}
            </p>
          </section>
        </div>
      </section>

      <section
        className="legacy-impact"
        aria-labelledby="legacy-impact-title"
      >
        <header className="legacy-section-heading">
          <p>行动结果</p>
          <div>
            <h2 id="legacy-impact-title">结果将在证据到位后逐项公开。</h2>
            <p>
              以下四项是项目核定的影响记录方向，不代表已经发生。
              每一项都保留独立的材料要求和公开状态。
            </p>
          </div>
        </header>

        <div className="legacy-impact__feature">
          <div className="legacy-impact__media">
            <AssetMedia
              asset={actionAsset}
              sizes="(min-width: 980px) 54vw, 100vw"
            />
          </div>
          <ol>
            {impacts.map((impact) => (
              <li key={impact.id}>
                <span>{String(impact.order).padStart(2, "0")}</span>
                <div>
                  <h3>{impact.title.value}</h3>
                  <p>{impact.description[0].text}</p>
                  <small>
                    {impact.evidenceStatus === "missing"
                      ? impact.evidenceRequirement
                      : impact.evidenceRef}
                  </small>
                </div>
                <StatusBadge status={impact.publicationStatus} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="legacy-timeline"
        aria-labelledby="legacy-timeline-title"
      >
        <header className="legacy-section-heading legacy-section-heading--light">
          <p>影响时间线</p>
          <div>
            <h2 id="legacy-timeline-title">从现场开始，沿证据继续前进。</h2>
            <p>
              当前展示的是核定工作链。节点完成后，状态、材料与日期会在同一条记录中更新。
            </p>
          </div>
        </header>

        <div className="legacy-timeline__body">
          <div className="legacy-timeline__media">
            <AssetMedia
              asset={evidenceAsset}
              sizes="(min-width: 980px) 42vw, 100vw"
            />
          </div>
          <ol>
            {timeline.map((entry) => (
              <li key={entry.id}>
                <span>{String(entry.order).padStart(2, "0")}</span>
                <div>
                  <p>{entry.period.value}</p>
                  <h3>{entry.title.value}</h3>
                  <p>{entry.description[0].text}</p>
                </div>
                <StatusBadge status={entry.publicationStatus} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="legacy-closing" aria-labelledby="legacy-closing-title">
        <div className="legacy-closing__media">
          <AssetMedia
            asset={closingAsset}
            sizes="(min-width: 980px) 56vw, 100vw"
          />
        </div>
        <div className="legacy-closing__copy">
          <p>下一次行动，从可核验的记录开始。</p>
          <h2 id="legacy-closing-title">
            继续走进地点，也继续追踪成果如何被使用。
          </h2>
          <div>
            <a href={withBasePath("/journey")}>
              浏览完整路线 <span aria-hidden="true">→</span>
            </a>
            <a href={withBasePath("/outcomes")}>
              查看成果状态 <span aria-hidden="true">→</span>
            </a>
            <span aria-disabled="true">联系团队 · 公开方式待补充</span>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
