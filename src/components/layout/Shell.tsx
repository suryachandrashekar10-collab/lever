import { NavLink, Outlet } from "react-router-dom";
import { useMemo } from "react";
import { Info, ListChecks, Grid3x3, AlertTriangle, BarChart3, PlusCircle } from "lucide-react";
import { useLeverStore } from "../../store/LeverStore";
import { isStalled } from "../../lib/stall";
import { useTheme } from "../../lib/useTheme";

const navItems = [
  { to: "/", label: "About", end: true, icon: Info },
  { to: "/backlog", label: "Backlog", icon: ListChecks },
  { to: "/matrix", label: "Priority Matrix", icon: Grid3x3 },
  { to: "/stalled", label: "Stalled", icon: AlertTriangle },
  { to: "/portfolio", label: "Portfolio", icon: BarChart3 },
  { to: "/submit", label: "Submit", icon: PlusCircle },
];

export function Shell() {
  const { useCases } = useLeverStore();
  const [theme, toggleTheme] = useTheme();
  const stalledCount = useMemo(() => useCases.filter((uc) => isStalled(uc)).length, [useCases]);

  return (
    <div className="min-h-screen bg-page text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <header className="sticky top-0 z-10 bg-brand-900">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-500 text-sm font-bold text-white">
              L
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight text-white">Lever</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">NavVis AI intake</p>
            </div>
          </div>

          <nav className="flex flex-1 items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-brand-500 text-white"
                        : "text-neutral-300 hover:bg-brand-800 hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
                  {item.label}
                  {item.to === "/stalled" && stalledCount > 0 && (
                    <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      {stalledCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <span className="rounded-full border border-brand-700 bg-brand-800 px-2.5 py-1 text-[11px] font-medium text-neutral-300">
              v0 &middot; 2026
            </span>
            <button
              onClick={toggleTheme}
              className="rounded-full border border-brand-700 px-2.5 py-1 text-[11px] font-medium text-neutral-300 hover:bg-brand-800 hover:text-white"
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
