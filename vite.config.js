import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const thirdPartyNotices = () => ({
  name: "third-party-notices",
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: "THIRD_PARTY_NOTICES.md",
      source: readFileSync(new URL("./THIRD_PARTY_NOTICES.md", import.meta.url), "utf8"),
    });
  },
});

export default defineConfig({
  cacheDir: ".vite-cache",
  plugins: [react(), thirdPartyNotices()],
});
