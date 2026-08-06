export const BLENDED_HOURLY_RATE_EUR = 60;
export const DAILY_BUILD_RATE_EUR = 480;

export const STALL_THRESHOLD_DAYS = 14;

export const IMPACT_THRESHOLD = 13; // Impact total >= this is "High impact"
export const EFFORT_THRESHOLD = 11; // Effort total <= this is "Low effort"

export const IMPACT_LABELS: Record<string, string> = {
  reach: "Reach: how many people the problem touches",
  time: "Time: hours returned per month",
  strategicPull: "Strategic pull: proximity to a stated leadership priority",
  risk: "Risk: compliance, security or single-point-of-failure reduction",
};

export const EFFORT_LABELS: Record<string, string> = {
  build: "Build: engineering days required",
  systems: "Systems: number and difficulty of systems touched",
  dataAccess: "Data access: is the data available, clean and permitted",
  change: "Change: how much human behaviour has to change for it to stick",
};
