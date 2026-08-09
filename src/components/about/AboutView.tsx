import { Link } from "react-router-dom";

export function AboutView() {
  return (
    <div className="mx-auto max-w-4xl">
      <section className="mb-12 grid items-center gap-8 sm:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Hello NavVis team, I'm Surya, and I'm genuinely glad you're here.
          </h1>
          <p className="mt-3 text-lg text-neutral-700 dark:text-neutral-300">
            This is Lever: an intake, scoring, and routing tool for AI and automation ideas, built as my
            application for the Associate AI Operations & Technology Specialist role.
          </p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <img
            src="/images/hero-handshake.jpg"
            alt="Two groups of dots, blue and green, reaching toward each other and interlocking"
            className="w-full object-cover"
          />
        </div>
      </section>

      <div className="mx-auto max-w-2xl">
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">Why I built this</h2>
          <p className="text-neutral-700 dark:text-neutral-300">
            I read the job description twice, then went looking for evidence of what it actually implied. The
            role exists to spot where AI and automation create leverage, and to unblock stalled projects. That
            phrasing only makes sense if there's currently no shared place where those ideas get collected,
            scored, and tracked. So I went and checked.
          </p>
          <p className="mt-3 text-neutral-700 dark:text-neutral-300">
            What I found, from live job postings and public employee reviews, not guesses: Revenue Ops is
            being asked to redesign lead handoffs by hand. Marketing is deduplicating HubSpot leads manually
            ahead of INTERGEO. Finance reviews and approves invoices one at a time. Recurring reviews mention
            "ineffective communication" and unclear ownership across teams. None of it was hard to find. It was
            just never in one place, scored the same way, so nobody could act on it as a set.
          </p>
          <p className="mt-3 text-neutral-700 dark:text-neutral-300">
            So instead of only writing about that gap, I built the thing that closes it, and seeded it with 13
            of those real, cited findings alongside 27 plausible ones, so the first screen you open already
            looks like a credible first draft of your own backlog.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-neutral-400">The problem, plainly</h2>
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

        <section className="mt-10 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">What I built, and how it works</h2>
          <p className="text-neutral-700 dark:text-neutral-300">
            Meet Marie, from Revenue Operations. Every month she spends most of a day cross-checking deal
            registrations that partners email in, half of them as PDFs, against what's actually in HubSpot.
            She already tried fixing it herself by pasting the PDFs into an LLM one at a time. It worked,
            but only for her, and only that month. She didn't know who to tell, or whether it was even worth
            telling anyone. So she typed it into Lever instead:
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
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-brand-500 px-3.5 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            See Marie's actual record →
          </Link>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-400">The loop, in short</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["Submit", "Plain language, six fields, under a minute."],
              ["Score", "Every submission gets scored the same way, automatically."],
              ["Route", "Systems touched tell you which teams need to be involved."],
              ["Track", "Nothing goes quiet. Stalled items get flagged, not forgotten."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-xs text-neutral-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 flex items-center gap-4">
          <img
            src="/images/persona.jpg"
            alt="Surya Chandrashekara"
            className="h-16 w-16 shrink-0 rounded-full border border-neutral-200 object-cover dark:border-neutral-800"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Who built this</p>
            <p className="font-semibold">Surya Chandrashekara</p>
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
            className="rounded-full bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            Submit your own
          </Link>
          <Link
            to="/backlog"
            className="rounded-full border border-neutral-300 px-4 py-2.5 text-sm font-semibold hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
          >
            Browse the backlog
          </Link>
        </div>
      </div>
    </div>
  );
}
