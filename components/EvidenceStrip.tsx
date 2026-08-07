export interface EvidenceField {
  label: string;
  value: string;
}

interface EvidenceStripProps {
  fields: readonly EvidenceField[];
  label?: string;
}

export function EvidenceStrip({
  fields,
  label = "档案证据信息",
}: EvidenceStripProps) {
  return (
    <dl className="evidence-strip" aria-label={label}>
      {fields.map((field) => {
        // 纯数字字段支持滚动计数（data-count 由 SiteMotion 动画）
        const isCountable = /^\d+$/.test(field.value);
        return (
          <div className="evidence-strip__item" key={field.label}>
            <dt>{field.label}</dt>
            <dd data-count={isCountable ? field.value : undefined}>
              {isCountable ? "0" : field.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
