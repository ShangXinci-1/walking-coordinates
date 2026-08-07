import type { OutcomeRecord } from "../../lib/content/types";
import { getRequiredAssetById } from "../../lib/content/selectors";
import { AssetMedia } from "../AssetMedia";
import { StatusBadge } from "../StatusBadge";

interface OutcomeRecordProps {
  outcome: OutcomeRecord;
  onOpenExhibition?: () => void;
  onOpenNewsArchive?: () => void;
  vrUrl?: string | null;
}

export function OutcomeRecordView({
  outcome,
  onOpenExhibition,
  onOpenNewsArchive,
  vrUrl,
}: OutcomeRecordProps) {
  const asset = outcome.assetId
    ? getRequiredAssetById(outcome.assetId)
    : null;
  const isExhibition = outcome.id === "digital-exhibition";
  const isNewsArchive = outcome.id === "digital-archive";

  return (
    <article
      className="outcome-record"
      data-completion={outcome.completionStatus}
      data-publication={outcome.publicationStatus}
    >
      <header className="outcome-record__header">
        <span>{String(outcome.order).padStart(2, "0")}</span>
        <div>
          <h3>{outcome.title.value}</h3>
        </div>
        <StatusBadge status={outcome.publicationStatus} />
      </header>

      {asset && (
        <div className="outcome-record__media">
          <AssetMedia
            asset={asset}
            sizes="(min-width: 980px) 48vw, 100vw"
          />
          {/* VR 入口：浮在图片右下角 */}
          {vrUrl && (
            <a
              className="outcome-record__vr"
              href={vrUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span className="outcome-record__vr-icon" aria-hidden="true">
                ◉
              </span>
              <span>
                <small>VR 全景</small>
                <strong>进入现场</strong>
              </span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      )}

      <div className="outcome-record__body">
        <p className="outcome-record__description">
          {outcome.description[0].text}
        </p>
        <div className="outcome-record__intro">
          {outcome.description.slice(1).map((block) => (
            <p key={block.id}>{block.text}</p>
          ))}
        </div>

        {isExhibition && onOpenExhibition && (
          <button
            type="button"
            className="outcome-record__access"
            data-kind="exhibition"
            onClick={onOpenExhibition}
          >
            进入展厅浏览
            <span aria-hidden="true">→</span>
          </button>
        )}

        {isNewsArchive && onOpenNewsArchive && (
          <button
            type="button"
            className="outcome-record__access"
            data-kind="exhibition"
            onClick={onOpenNewsArchive}
          >
            打开新闻稿档案袋
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </article>
  );
}
