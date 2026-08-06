import { NavLink, Outlet } from "react-router-dom";
import { useMemo } from "react";
import { useLeverStore } from "../../store/LeverStore";
import { isStalled } from "../../lib/stall";

const navItems = [
  { to: "/", label: "Backlog", end: true },
  { to: "/matrix", label: "2x2" },
  { to: "/stalled", label: "Stalled" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/submit", label: "Submit" },
];

export function Shell() {
  const { useCases } = useLeverStore();
  const stalledCount = useMemo(() => useCases.filter((uc) => isStalled(uc)).length, [useCases]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
        <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold tracking-tight">Lever</span>
            <span className="hidden text-xs text-neutral-400 sm:inline">AI &amp; automation intake for NavVis</span>
          </div>
          <nav className="flex flex-1 items-center gap-1 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 font-medium transition-colors ${
                    isActive
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                      : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  }`
                }
              >
                {item.label}
                {item.to === "/stalled" && stalledCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {stalledCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
