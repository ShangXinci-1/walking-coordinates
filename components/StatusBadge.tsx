import type { PublicationStatus } from "../lib/content/types";

const statusLabels: Record<PublicationStatus, string> = {
  placeholder: "示意素材",
  planned: "内容筹备中",
  partial: "部分开放",
  ready: "已开放",
};

interface StatusBadgeProps {
  status: PublicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className="status-badge" data-status={status}>
      <span className="status-badge__marker" aria-hidden="true" />
      {statusLabels[status]}
    </span>
  );
}
