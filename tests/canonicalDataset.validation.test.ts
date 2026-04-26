import { describe, expect, it } from "vitest";

import { validateCanonicalDataset, type CanonicalDataset } from "../src/canonicalDataset";

describe("validateCanonicalDataset", () => {
  it("returns no issues for a valid dataset", () => {
    const dataset: CanonicalDataset = {
      traits: [{ apiName: "TFT_TRAIT_SCHOLAR", breakpointCounts: [2, 4, 6] }],
      champions: [{ apiName: "TFT_UNIT_AHRI", traitApiNames: ["TFT_TRAIT_SCHOLAR"] }],
    };

    expect(validateCanonicalDataset(dataset)).toEqual([]);
  });

  it("returns issues for duplicates and unknown trait references", () => {
    const dataset: CanonicalDataset = {
      traits: [{ apiName: "TFT_TRAIT_SCHOLAR", breakpointCounts: [2] }, { apiName: "TFT_TRAIT_SCHOLAR", breakpointCounts: [4] }],
      champions: [
        { apiName: "TFT_UNIT_AHRI", traitApiNames: ["TFT_TRAIT_SCHOLAR", "TFT_TRAIT_NOT_REAL"] },
        { apiName: "TFT_UNIT_AHRI", traitApiNames: ["TFT_TRAIT_SCHOLAR"] },
      ],
    };

    const issues = validateCanonicalDataset(dataset);
    expect(issues).toEqual([
      { path: "traits[1].apiName", message: "Duplicate trait apiName: TFT_TRAIT_SCHOLAR" },
      {
        path: "champions[0].traitApiNames[1]",
        message: "Unknown trait apiName: TFT_TRAIT_NOT_REAL",
      },
      { path: "champions[1].apiName", message: "Duplicate champion apiName: TFT_UNIT_AHRI" },
    ]);
  });
});
