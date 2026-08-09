import type { ReactNode } from "react";

interface Props {
  eyebrow: string;
  icon: ReactNode;
  iconColor?: string;
  title: string;
  description: ReactNode;
  badge?: ReactNode;
  action?: ReactNode;
}

export function PageHeader({ eyebrow, icon, iconColor = "bg-brand-500", title, description, badge, action }: Props) {
  return (
    <div className="mb-6 border-b border-neutral-200 pb-6 dark:border-neutral-800">
      <p className="mb-2 font-mono text-xs uppercase tracking-wider text-neutral-400">{eyebrow}</p>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white ${iconColor}`}>
            {icon}
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-1 max-w-2xl text-sm text-neutral-500">{description}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {badge}
          {action}
        </div>
      </div>
    </div>
  );
}

export function HeaderBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-neutral-900">
      {children}
    </span>
  );
}
