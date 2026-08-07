import { Link } from "react-router-dom";

export function AboutView() {
  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-1 font-mono text-xs uppercase tracking-wider text-neutral-400">06 / About</p>
      <h1 className="text-2xl font-semibold tracking-tight">What is Lever, and why does it exist?</h1>
      <p className="mt-3 text-lg text-neutral-700 dark:text-neutral-300">
        Lever is a place to put an idea for an AI or automation project, and get back an honest answer:
        is this worth doing, how much would it save, and who needs to be in the room.
      </p>

      <img
        src="/images/hero-signal.jpg"
        alt="Scattered, unranked signals on the left resolving into an ordered, ranked column on the right"
        className="mt-6 w-full rounded-xl border border-neutral-200 dark:border-neutral-800"
      />

      <section className="mt-10">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">The problem</h2>
        <p className="text-neutral-700 dark:text-neutral-300">
          Most companies have dozens of small, painful, manual processes. Somebody re-types the same data
          into two systems every week. Somebody spends a day a month reconciling a spreadsheet by hand.
          Somebody quietly builds a fix with ChatGPT in a browser tab, and nobody else ever hears about it.
        </p>
        <p className="mt-3 text-neutral-700 dark:text-neutral-300">
          None of that is written down anywhere. So nobody can compare it, rank it, or notice that two
          teams just built the same thing twice. Lever is that missing place.
        </p>
      </section>

      <section className="mt-10 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">Meet Marie</h2>
        <p className="text-neutral-700 dark:text-neutral-300">
          Marie works in Revenue Operations. Every month she spends most of a day cross-checking deal
          registrations that partners email in, half of them as PDFs, against what's actually in HubSpot.
          She already tried fixing it herself by pasting the PDFs into an LLM one at a time. It worked,
          but only for her, and only that month.
        </p>
        <p className="mt-3 text-neutral-700 dark:text-neutral-300">
          Marie didn't know who to tell, or whether it was even worth telling anyone. So she typed it into
          Lever instead:
        </p>
        <ol className="mt-4 space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
          <li className="flex gap-3">
            <span className="font-mono text-neutral-400">1</span>
            <span>She wrote one line and a couple of sentences describing what she does today. Took her under a minute.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-neutral-400">2</span>
            <span>Lever scored it automatically and gave it a leverage number and a tier, before anyone looked at it.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-neutral-400">3</span>
            <span>It flagged that Finance had submitted something suspiciously similar, so the two didn't get built twice.</span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-neutral-400">4</span>
            <span>It's now sitting in the backlog with a real value estimate attached, waiting on an owner, visible to anyone who opens Lever.</span>
          </li>
        </ol>
        <Link
          to="/use-cases/LEV-008"
          className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-neutral-900 px-3.5 py-2 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          See Marie's actual record →
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-400">How it works</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Submit", "Plain language, six fields, under a minute."],
            ["Score", "Every submission gets scored the same way, automatically."],
            ["Route", "Systems touched tell you which teams need to be involved."],
            ["Track", "Nothing goes quiet. Stalled items get flagged, not forgotten."],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-xs text-neutral-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">Who it's for</h2>
        <p className="text-neutral-700 dark:text-neutral-300">
          Anyone at NavVis with a repetitive, manual, or annoying process, regardless of function or
          technical background. You don't need to know what "impact" or "effort" mean in a scoring sense.
          You just describe the problem. Lever does the rest.
        </p>
      </section>

      <div className="mt-10 flex gap-3">
        <Link
          to="/submit"
          className="rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Submit your own
        </Link>
        <Link
          to="/"
          className="rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-semibold hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Browse the backlog
        </Link>
      </div>
    </div>
  );
}
