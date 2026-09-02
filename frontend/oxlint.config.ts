import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript"],
  options: {
    typeAware: true,
    typeCheck: true,
  },
  categories: {
    correctness: "error",
    suspicious: "warn",
    pedantic: "off",
  },
});
