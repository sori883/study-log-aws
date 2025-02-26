import { reactRouter } from "@react-router/dev/vite";
import serverAdapter from "hono-react-router-adapter/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { getLoadContext } from "./load-context";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    serverAdapter({
      getLoadContext,
      entry: "./server/index.ts",
    }),
    tsconfigPaths(),
  ],
})