import type { OxlintConfig } from "oxlint";

export const baseOxlintConfig: OxlintConfig = {
  options: {
    typeAware: true,
    typeCheck: true,
  },
  categories: {
    correctness: "error",
    suspicious: "warn",
    pedantic: "off",
  },
};
