export interface CanonicalChampion {
  apiName: string;
  traitApiNames: string[];
}

export interface CanonicalTrait {
  apiName: string;
  breakpointCounts: number[];
}

export interface CanonicalDataset {
  champions: CanonicalChampion[];
  traits: CanonicalTrait[];
}

export interface BoardUnit {
  championApiName: string;
  starLevel?: 1 | 2 | 3 | 4;
  itemApiNames?: string[];
  emblemTraitApiNames?: string[];
  position?: {
    row: number;
    column: number;
  };
}

export interface TraitActivation {
  traitApiName: string;
  count: number;
  activeBreakpointCount: number | null;
}

export interface BoardEvaluationDiagnostics {
  unknownChampionApiNames: string[];
  unknownEmblemTraitApiNames: string[];
}

export interface BoardEvaluationResult {
  traitActivations: TraitActivation[];
  diagnostics: BoardEvaluationDiagnostics;
}

export interface CanonicalDatasetValidationIssue {
  path: string;
  message: string;
}

export function validateCanonicalDataset(
  dataset: CanonicalDataset,
): CanonicalDatasetValidationIssue[] {
  const issues: CanonicalDatasetValidationIssue[] = [];

  const traitApiNames = new Set<string>();
  dataset.traits.forEach((trait, index) => {
    if (traitApiNames.has(trait.apiName)) {
      issues.push({
        path: `traits[${index}].apiName`,
        message: `Duplicate trait apiName: ${trait.apiName}`,
      });
    }
    traitApiNames.add(trait.apiName);
  });

  const championApiNames = new Set<string>();
  dataset.champions.forEach((champion, championIndex) => {
    if (championApiNames.has(champion.apiName)) {
      issues.push({
        path: `champions[${championIndex}].apiName`,
        message: `Duplicate champion apiName: ${champion.apiName}`,
      });
    }
    championApiNames.add(champion.apiName);

    champion.traitApiNames.forEach((traitApiName, traitIndex) => {
      if (!traitApiNames.has(traitApiName)) {
        issues.push({
          path: `champions[${championIndex}].traitApiNames[${traitIndex}]`,
          message: `Unknown trait apiName: ${traitApiName}`,
        });
      }
    });
  });

  return issues;
}

export function evaluateBoard(
  dataset: CanonicalDataset,
  board: string[] | BoardUnit[],
): BoardEvaluationResult {
  const championByApiName = new Map(
    dataset.champions.map((champion) => [champion.apiName, champion]),
  );

  const traitByApiName = new Map(dataset.traits.map((trait) => [trait.apiName, trait]));

  const normalizedBoardUnits: BoardUnit[] = board.map((entry) =>
    typeof entry === "string" ? { championApiName: entry } : entry,
  );

  const traitCounts = new Map<string, number>();
  const unknownChampionApiNameSet = new Set<string>();
  const unknownEmblemTraitApiNameSet = new Set<string>();

  for (const unit of normalizedBoardUnits) {
    const champion = championByApiName.get(unit.championApiName);
    const uniqueUnitTraits = new Set<string>();

    if (!champion) {
      unknownChampionApiNameSet.add(unit.championApiName);
    } else {
      for (const championTraitApiName of champion.traitApiNames) {
        if (traitByApiName.has(championTraitApiName)) {
          uniqueUnitTraits.add(championTraitApiName);
        }
      }
    }

    for (const emblemTraitApiName of unit.emblemTraitApiNames ?? []) {
      if (!traitByApiName.has(emblemTraitApiName)) {
        unknownEmblemTraitApiNameSet.add(emblemTraitApiName);
        continue;
      }
      uniqueUnitTraits.add(emblemTraitApiName);
    }

    for (const traitApiName of uniqueUnitTraits) {
      traitCounts.set(traitApiName, (traitCounts.get(traitApiName) ?? 0) + 1);
    }
  }

  const traitActivations: TraitActivation[] = [];
  for (const trait of dataset.traits) {
    const count = traitCounts.get(trait.apiName) ?? 0;
    if (count === 0) {
      continue;
    }

    const sortedBreakpoints = [...trait.breakpointCounts].sort((a, b) => a - b);
    let activeBreakpointCount: number | null = null;
    for (const breakpointCount of sortedBreakpoints) {
      if (count >= breakpointCount) {
        activeBreakpointCount = breakpointCount;
      }
    }

    traitActivations.push({
      traitApiName: trait.apiName,
      count,
      activeBreakpointCount,
    });
  }

  return {
    traitActivations,
    diagnostics: {
      unknownChampionApiNames: [...unknownChampionApiNameSet].sort(),
      unknownEmblemTraitApiNames: [...unknownEmblemTraitApiNameSet].sort(),
    },
  };
}
