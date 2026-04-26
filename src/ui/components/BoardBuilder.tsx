import type { BoardUnit } from "../../engine";

interface BoardBuilderProps {
  availableChampions: string[];
  board: BoardUnit[];
  unknownUnitInput: string;
  onUnknownUnitInputChange: (value: string) => void;
  onAddUnknownUnit: () => void;
  onAddChampion: (championApiName: string) => void;
  onRemoveChampion: (index: number) => void;
}

export function BoardBuilder({
  availableChampions,
  board,
  unknownUnitInput,
  onUnknownUnitInputChange,
  onAddUnknownUnit,
  onAddChampion,
  onRemoveChampion,
}: BoardBuilderProps) {
  return (
    <section>
      <h2>Board Builder</h2>
      <p>Available champions</p>
      <div className="button-row">
        {availableChampions.map((championApiName) => (
          <button key={championApiName} onClick={() => onAddChampion(championApiName)} type="button">
            Add {championApiName}
          </button>
        ))}
      </div>

      <div className="unknown-unit-row">
        <input
          aria-label="Unknown champion api name"
          value={unknownUnitInput}
          onChange={(event) => onUnknownUnitInputChange(event.target.value)}
          placeholder="Add custom api name"
        />
        <button type="button" onClick={onAddUnknownUnit}>
          Add custom unit
        </button>
      </div>

      <p>Current board</p>
      <ul>
        {board.map((unit, index) => (
          <li key={`${unit.championApiName}-${index}`}>
            {unit.championApiName}
            <button type="button" onClick={() => onRemoveChampion(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
