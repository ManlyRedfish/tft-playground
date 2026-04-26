import type { TraitActivation } from "../../engine";

interface TraitListProps {
  traitActivations: TraitActivation[];
}

export function TraitList({ traitActivations }: TraitListProps) {
  return (
    <section>
      <h2>Active Traits</h2>
      {traitActivations.length === 0 ? (
        <p>No active traits.</p>
      ) : (
        <ul>
          {traitActivations.map((activation) => (
            <li key={activation.traitApiName}>
              {activation.traitApiName}: {activation.count} units (active breakpoint: {activation.activeBreakpointCount ?? "none"})
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
