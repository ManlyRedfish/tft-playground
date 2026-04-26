import type { BoardEvaluationDiagnostics } from "../../engine";

interface TraitScore {
  traitApiName: string;
  score: number;
}

interface ScorePanelProps {
  totalSynergyScore: number;
  traitScoreBreakdown: TraitScore[];
  diagnostics: BoardEvaluationDiagnostics;
}

export function ScorePanel({ totalSynergyScore, traitScoreBreakdown, diagnostics }: ScorePanelProps) {
  return (
    <section>
      <h2>Score</h2>
      <p>Total synergy score: {totalSynergyScore}</p>

      <h3>Trait score breakdown</h3>
      {traitScoreBreakdown.length === 0 ? (
        <p>No trait score yet.</p>
      ) : (
        <ul>
          {traitScoreBreakdown.map((entry) => (
            <li key={entry.traitApiName}>
              {entry.traitApiName}: {entry.score}
            </li>
          ))}
        </ul>
      )}

      <h3>Diagnostics</h3>
      <p>Unknown champions: {diagnostics.unknownChampionApiNames.join(", ") || "none"}</p>
      <p>Unknown emblem traits: {diagnostics.unknownEmblemTraitApiNames.join(", ") || "none"}</p>
    </section>
  );
}
