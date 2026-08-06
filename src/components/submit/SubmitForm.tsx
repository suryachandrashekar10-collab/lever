import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLeverStore } from "../../store/LeverStore";
import { findRelated } from "../../lib/related";
import { ALL_FREQUENCIES, ALL_FUNCTIONS, type Frequency, type Function8 } from "../../types";

export function SubmitForm() {
  const { useCases, addUseCase } = useLeverStore();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterFunction, setSubmitterFunction] = useState<Function8>("Revenue");
  const [problemFrequency, setProblemFrequency] = useState<Frequency>("Weekly");
  const [peopleAffected, setPeopleAffected] = useState(5);
  const [hoursSavedMonthly, setHoursSavedMonthly] = useState(5);

  const related = useMemo(() => {
    if (title.trim().length < 4 && description.trim().length < 10) return [];
    return findRelated({ title, description, systemsTouched: [], submitterFunction }, useCases).slice(0, 3);
  }, [title, description, submitterFunction, useCases]);

  const canSubmit = title.trim().length > 0 && description.trim().length > 0 && submitterName.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const created = addUseCase({
      title: title.trim(),
      description: description.trim(),
      submitterName: submitterName.trim(),
      submitterFunction,
      problemFrequency,
      peopleAffected,
      hoursSavedMonthly,
      systemsTouched: [],
    });
    navigate(`/use-cases/${created.id}`);
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-1 text-xl font-semibold">Submit a use case</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Plain language, under a minute. No taxonomy required: Lever scores and routes it for you.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="What's the problem, in one line?">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            placeholder="e.g. Reconciling partner deal registrations in HubSpot"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            required
          />
        </Field>

        <Field label="Describe it in your own words">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What do you do today, how often, and why does it hurt?"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            required
          />
        </Field>

        {related.length > 0 && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
            <p className="mb-1 font-semibold">This might already exist:</p>
            <ul className="space-y-0.5">
              {related.map((r) => {
                const other = useCases.find((u) => u.id === r.useCaseId);
                return (
                  <li key={r.useCaseId}>
                    {other?.title} <span className="opacity-70">({other?.submitterFunction}, {r.reason})</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-1 opacity-80">You can still submit. Lever will flag it as related.</p>
          </div>
        )}

        <Field label="Your name">
          <input
            value={submitterName}
            onChange={(e) => setSubmitterName(e.target.value)}
            placeholder="So people know who to ask"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            required
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Your function">
            <select
              value={submitterFunction}
              onChange={(e) => setSubmitterFunction(e.target.value as Function8)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              {ALL_FUNCTIONS.map((fn) => (
                <option key={fn} value={fn}>
                  {fn}
                </option>
              ))}
            </select>
          </Field>
          <Field label="How often does this come up?">
            <select
              value={problemFrequency}
              onChange={(e) => setProblemFrequency(e.target.value as Frequency)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              {ALL_FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label={`People affected: ${peopleAffected}`}>
            <input
              type="range"
              min={1}
              max={100}
              value={peopleAffected}
              onChange={(e) => setPeopleAffected(Number(e.target.value))}
              className="w-full accent-neutral-900 dark:accent-white"
            />
          </Field>
          <Field label={`Hours saved / month: ${hoursSavedMonthly}`}>
            <input
              type="range"
              min={0}
              max={80}
              value={hoursSavedMonthly}
              onChange={(e) => setHoursSavedMonthly(Number(e.target.value))}
              className="w-full accent-neutral-900 dark:accent-white"
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-700 disabled:opacity-40 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          Submit, see your score instantly
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-neutral-600 dark:text-neutral-400">{label}</span>
      {children}
    </label>
  );
}
