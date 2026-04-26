import type { CanonicalDataset } from "../canonicalDataset";

export const sampleDataset: CanonicalDataset = {
  traits: [
    { apiName: "TFT_TRAIT_ACADEMY", breakpointCounts: [2, 4] },
    { apiName: "TFT_TRAIT_SCHOLAR", breakpointCounts: [2, 4] },
    { apiName: "TFT_TRAIT_SCRAP", breakpointCounts: [2, 4] },
  ],
  champions: [
    { apiName: "TFT_UNIT_LEONA", traitApiNames: ["TFT_TRAIT_ACADEMY"] },
    { apiName: "TFT_UNIT_HEIMERDINGER", traitApiNames: ["TFT_TRAIT_SCHOLAR"] },
    { apiName: "TFT_UNIT_EKKO", traitApiNames: ["TFT_TRAIT_SCRAP"] },
    { apiName: "TFT_UNIT_JAYCE", traitApiNames: ["TFT_TRAIT_ACADEMY", "TFT_TRAIT_SCHOLAR"] },
  ],
};
