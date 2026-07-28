import type { OutcomeRecord } from "../../lib/content/types";
import { getRequiredAssetById } from "../../lib/content/selectors";
import { AssetMedia } from "../AssetMedia";
import { StatusBadge } from "../StatusBadge";

const completionLabels = {
  planned: "尚未交付",
  "in-progress": "制作中",
  complete: "已完成",
} as const;

interface OutcomeRecordProps {
  outcome: OutcomeRecord;
}

export function OutcomeRecordView({ outcome }: OutcomeRecordProps) {
  const asset = outcome.assetId
    ? getRequiredAssetById(outcome.assetId)
    : null;
  const isComplete = outcome.completionStatus === "complete";

  return (
    <article
      className="outcome-record"
      data-completion={outcome.completionStatus}
      data-publication={outcome.publicationStatus}
    >
      <header className="outcome-record__header">
        <span>{String(outcome.order).padStart(2, "0")}</span>
        <div>
          <p>{completionLabels[outcome.completionStatus]}</p>
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
        </div>
      )}

      <div className="outcome-record__body">
        <p className="outcome-record__description">
          {outcome.description[0].text}
        </p>
        <dl>
          <div>
            <dt>成果负责人</dt>
            <dd>
              {outcome.ownerRole === "outcome-owner"
                ? "项目成果负责人（待确认）"
                : outcome.ownerRole}
            </dd>
          </div>
          <div>
            <dt>最近更新</dt>
            <dd>
              <time dateTime={outcome.updatedAt}>{outcome.updatedAt}</time>
            </dd>
          </div>
          <div>
            <dt>公开状态</dt>
            <dd>{outcome.publicationStatus === "ready" ? "可访问" : "不可访问"}</dd>
          </div>
        </dl>

        {isComplete ? (
          <a
            className="outcome-record__access"
            href={outcome.access.href}
            data-kind={outcome.access.kind}
          >
            {outcome.access.label}
            <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <div className="outcome-record__gate">
            <strong>达到以下条件后开放</strong>
            <p>{outcome.deliveryCondition}</p>
          </div>
        )}
      </div>
    </article>
  );
}
