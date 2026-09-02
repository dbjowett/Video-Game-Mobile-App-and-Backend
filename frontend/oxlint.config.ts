import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript"],
  options: {
    typeAware: true,
  },
});
