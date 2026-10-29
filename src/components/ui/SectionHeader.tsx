import React from "react";
import { FormattedMessage } from "react-intl";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  tag?: React.ReactNode;
  tagId?: string;
  title?: React.ReactNode;
  titleId?: string;
  subtitle?: React.ReactNode;
  subtitleId?: string;
  tagColor?: "emerald" | "sky";
  align?: "center" | "left";
  className?: string;
}

export function SectionHeader({
  tag,
  tagId,
  title,
  titleId,
  subtitle,
  subtitleId,
  tagColor = "emerald",
  align = "center",
  className,
}: SectionHeaderProps) {
  const tagColorClass =
    tagColor === "emerald"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-sky-600 dark:text-sky-400";

  const alignmentClass =
    align === "center"
      ? "text-center max-w-3xl mx-auto"
      : "text-left max-w-3xl";

  return (
    <div className={cn(alignmentClass, "mb-12 sm:mb-16", className)}>
      {(tag || tagId) && (
        <span className={cn("text-xs font-bold uppercase tracking-wider block", tagColorClass)}>
          {tagId ? <FormattedMessage id={tagId} /> : tag}
        </span>
      )}

      {(title || titleId) && (
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-2 tracking-tight">
          {titleId ? <FormattedMessage id={titleId} /> : title}
        </h2>
      )}

      {(subtitle || subtitleId) && (
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
          {subtitleId ? <FormattedMessage id={subtitleId} /> : subtitle}
        </p>
      )}
    </div>
  );
}
