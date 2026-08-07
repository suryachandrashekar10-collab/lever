import { NavLink, Outlet } from "react-router-dom";
import { useMemo } from "react";
import { useLeverStore } from "../../store/LeverStore";
import { isStalled } from "../../lib/stall";
import { useTheme } from "../../lib/useTheme";
import { BLENDED_HOURLY_RATE_EUR, DAILY_BUILD_RATE_EUR, STALL_THRESHOLD_DAYS } from "../../lib/constants";

const navItems = [
  { to: "/", label: "Backlog", end: true },
  { to: "/matrix", label: "2x2" },
  { to: "/stalled", label: "Stalled" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/submit", label: "Submit" },
  { to: "/about", label: "About" },
];

export function Shell() {
  const { useCases } = useLeverStore();
  const [theme, toggleTheme] = useTheme();
  const stalledCount = useMemo(() => useCases.filter((uc) => isStalled(uc)).length, [useCases]);

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white px-4 py-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mb-8">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-semibold tracking-tight">Lever</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
            NavVis AI intake
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 text-sm">
          {navItems.map((item, i) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-md px-2.5 py-1.5 font-medium transition-colors ${
                  isActive
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`
              }
            >
              <span className="flex items-center gap-2">
                <span className="font-mono text-[10px] opacity-50">{String(i + 1).padStart(2, "0")}</span>
                {item.label}
              </span>
              {item.to === "/stalled" && stalledCount > 0 && (
                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {stalledCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 border-t border-neutral-100 pt-3 text-[11px] text-neutral-400 dark:border-neutral-800">
          <div className="flex justify-between">
            <span>rate / h</span>
            <span className="font-mono">€{BLENDED_HOURLY_RATE_EUR}</span>
          </div>
          <div className="flex justify-between">
            <span>build / day</span>
            <span className="font-mono">€{DAILY_BUILD_RATE_EUR}</span>
          </div>
          <div className="flex justify-between">
            <span>stall after</span>
            <span className="font-mono">{STALL_THRESHOLD_DAYS}d</span>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="mt-3 rounded-md border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
      </aside>

      <main className="mx-auto w-full max-w-6xl flex-1 px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
