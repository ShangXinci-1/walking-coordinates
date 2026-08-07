import type { PublicationStatus } from "../lib/content/types";

const statusLabels: Record<PublicationStatus, string> = {
  placeholder: "示意素材",
  planned: "",
  partial: "部分开放",
  ready: "已开放",
};

interface StatusBadgeProps {
  status: PublicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  // 筹备中状态不显示提示词
  if (status === "planned") return null;

  return (
    <span className="status-badge" data-status={status}>
      <span className="status-badge__marker" aria-hidden="true" />
      {statusLabels[status]}
    </span>
  );
}
