import type { FieldSchema } from "../../types/schema";

export function StaticLegalText({ field }: { field: FieldSchema }) {
  const paragraphs = (field.staticText ?? "").split("\n\n");

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={i > 0 ? "mt-3" : ""}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}
