import { describe, expect, it } from "vitest";

import { evaluateBoard, type BoardUnit, type CanonicalDataset } from "../src/canonicalDataset";

const dataset: CanonicalDataset = {
  traits: [
    { apiName: "TFT_TRAIT_ACADEMY", breakpointCounts: [2, 4] },
    { apiName: "TFT_TRAIT_SCHOLAR", breakpointCounts: [2, 4] },
    { apiName: "TFT_TRAIT_SCRAP", breakpointCounts: [2, 4] },
  ],
  champions: [
    { apiName: "TFT_UNIT_LEONA", traitApiNames: ["TFT_TRAIT_ACADEMY"] },
    { apiName: "TFT_UNIT_EKKO", traitApiNames: ["TFT_TRAIT_SCRAP"] },
    { apiName: "TFT_UNIT_HEIMERDINGER", traitApiNames: ["TFT_TRAIT_SCHOLAR"] },
  ],
};

describe("evaluateBoard", () => {
  it("existing string[] board input still works", () => {
    const result = evaluateBoard(dataset, ["TFT_UNIT_LEONA", "TFT_UNIT_HEIMERDINGER"]);

    expect(result.traitActivations).toEqual([
      { traitApiName: "TFT_TRAIT_ACADEMY", count: 1, activeBreakpointCount: null },
      { traitApiName: "TFT_TRAIT_SCHOLAR", count: 1, activeBreakpointCount: null },
    ]);
    expect(result.diagnostics).toEqual({ unknownChampionApiNames: [], unknownEmblemTraitApiNames: [] });
  });

  it("BoardUnit[] board input works", () => {
    const board: BoardUnit[] = [
      { championApiName: "TFT_UNIT_EKKO", starLevel: 2, itemApiNames: ["TFT_ITEM_BF_SWORD"] },
      { championApiName: "TFT_UNIT_HEIMERDINGER", position: { row: 0, column: 1 } },
    ];

    const result = evaluateBoard(dataset, board);
    expect(result.traitActivations).toEqual([
      { traitApiName: "TFT_TRAIT_SCHOLAR", count: 1, activeBreakpointCount: null },
      { traitApiName: "TFT_TRAIT_SCRAP", count: 1, activeBreakpointCount: null },
    ]);
  });

  it("duplicate BoardUnit entries count separately", () => {
    const board: BoardUnit[] = [
      { championApiName: "TFT_UNIT_LEONA" },
      { championApiName: "TFT_UNIT_LEONA" },
    ];

    const result = evaluateBoard(dataset, board);
    expect(result.traitActivations).toEqual([
      { traitApiName: "TFT_TRAIT_ACADEMY", count: 2, activeBreakpointCount: 2 },
    ]);
  });

  it("emblemTraitApiNames add trait activations", () => {
    const board: BoardUnit[] = [
      {
        championApiName: "TFT_UNIT_LEONA",
        emblemTraitApiNames: ["TFT_TRAIT_SCHOLAR"],
      },
      { championApiName: "TFT_UNIT_HEIMERDINGER" },
    ];

    const result = evaluateBoard(dataset, board);
    expect(result.traitActivations).toEqual([
      { traitApiName: "TFT_TRAIT_ACADEMY", count: 1, activeBreakpointCount: null },
      { traitApiName: "TFT_TRAIT_SCHOLAR", count: 2, activeBreakpointCount: 2 },
    ]);
  });

  it("duplicate emblem traits on one BoardUnit do not double-count", () => {
    const board: BoardUnit[] = [
      {
        championApiName: "TFT_UNIT_EKKO",
        emblemTraitApiNames: ["TFT_TRAIT_ACADEMY", "TFT_TRAIT_ACADEMY"],
      },
    ];

    const result = evaluateBoard(dataset, board);
    expect(result.traitActivations).toEqual([
      { traitApiName: "TFT_TRAIT_ACADEMY", count: 1, activeBreakpointCount: null },
      { traitApiName: "TFT_TRAIT_SCRAP", count: 1, activeBreakpointCount: null },
    ]);
  });

  it("unknown champion diagnostics still work", () => {
    const result = evaluateBoard(dataset, ["TFT_UNIT_DOES_NOT_EXIST"]);

    expect(result.traitActivations).toEqual([]);
    expect(result.diagnostics).toEqual({
      unknownChampionApiNames: ["TFT_UNIT_DOES_NOT_EXIST"],
      unknownEmblemTraitApiNames: [],
    });
  });

  it("unknown emblem trait diagnostics are reported", () => {
    const board: BoardUnit[] = [
      {
        championApiName: "TFT_UNIT_LEONA",
        emblemTraitApiNames: ["TFT_TRAIT_NOT_REAL", "TFT_TRAIT_NOT_REAL"],
      },
    ];

    const result = evaluateBoard(dataset, board);

    expect(result.traitActivations).toEqual([
      { traitApiName: "TFT_TRAIT_ACADEMY", count: 1, activeBreakpointCount: null },
    ]);
    expect(result.diagnostics).toEqual({
      unknownChampionApiNames: [],
      unknownEmblemTraitApiNames: ["TFT_TRAIT_NOT_REAL"],
    });
  });
});
