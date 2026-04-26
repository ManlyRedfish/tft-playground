import { useMemo, useState } from "react";

import { evaluateBoard, type BoardUnit } from "../engine";
import { sampleDataset } from "../engine";
import { BoardBuilder } from "./components/BoardBuilder";
import { ScorePanel } from "./components/ScorePanel";
import { TraitList } from "./components/TraitList";

export function App() {
  const [board, setBoard] = useState<BoardUnit[]>([]);
  const [unknownUnitInput, setUnknownUnitInput] = useState("");

  const evaluation = useMemo(() => evaluateBoard(sampleDataset, board), [board]);

  const traitScoreBreakdown = evaluation.traitActivations.map((activation) => ({
    traitApiName: activation.traitApiName,
    score: activation.activeBreakpointCount ?? 0,
  }));

  const totalSynergyScore = traitScoreBreakdown.reduce((total, trait) => total + trait.score, 0);

  function addChampion(championApiName: string) {
    setBoard((current) => [...current, { championApiName }]);
  }

  function removeChampion(index: number) {
    setBoard((current) => current.filter((_, currentIndex) => currentIndex !== index));
  }

  function addUnknownChampion() {
    if (!unknownUnitInput.trim()) {
      return;
    }

    setBoard((current) => [...current, { championApiName: unknownUnitInput.trim() }]);
    setUnknownUnitInput("");
  }

  return (
    <main className="container">
      <h1>TFT Board Evaluator</h1>
      <BoardBuilder
        availableChampions={sampleDataset.champions.map((champion) => champion.apiName)}
        board={board}
        unknownUnitInput={unknownUnitInput}
        onUnknownUnitInputChange={setUnknownUnitInput}
        onAddUnknownUnit={addUnknownChampion}
        onAddChampion={addChampion}
        onRemoveChampion={removeChampion}
      />
      <TraitList traitActivations={evaluation.traitActivations} />
      <ScorePanel
        totalSynergyScore={totalSynergyScore}
        traitScoreBreakdown={traitScoreBreakdown}
        diagnostics={evaluation.diagnostics}
      />
    </main>
  );
}
