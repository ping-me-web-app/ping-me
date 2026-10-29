import React from "react";
import { CheckCircle2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actionButton?: React.ReactNode;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  iconBgColor?: string;
  iconColor?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SuccessState({
  title,
  description,
  actionButton,
  icon: Icon = CheckCircle2,
  iconBgColor = "bg-emerald-100 dark:bg-emerald-950",
  iconColor = "text-emerald-600 dark:text-emerald-400",
  size = "md",
  className,
}: SuccessStateProps) {
  const sizeConfig = {
    sm: {
      container: "py-6 space-y-2.5",
      circle: "w-12 h-12",
      icon: "w-6 h-6",
      title: "text-lg",
      desc: "text-xs",
    },
    md: {
      container: "py-8 space-y-3",
      circle: "w-14 h-14",
      icon: "w-8 h-8",
      title: "text-xl",
      desc: "text-xs sm:text-sm",
    },
    lg: {
      container: "py-12 space-y-4",
      circle: "w-16 h-16",
      icon: "w-9 h-9",
      title: "text-2xl",
      desc: "text-sm",
    },
  }[size];

  return (
    <div className={cn("text-center animate-in fade-in duration-300", sizeConfig.container, className)}>
      <div
        className={cn(
          "mx-auto rounded-full flex items-center justify-center transition-transform",
          sizeConfig.circle,
          iconBgColor,
          iconColor
        )}
      >
        <Icon className={sizeConfig.icon} />
      </div>

      <div className="space-y-1">
        <h3 className={cn("font-display font-bold text-slate-900 dark:text-white", sizeConfig.title)}>
          {title}
        </h3>
        {description && (
          <p className={cn("text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed", sizeConfig.desc)}>
            {description}
          </p>
        )}
      </div>

      {actionButton && <div className="pt-3">{actionButton}</div>}
    </div>
  );
}
