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
      {fields.map((field) => (
        <div className="evidence-strip__item" key={field.label}>
          <dt>{field.label}</dt>
          <dd>{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}
