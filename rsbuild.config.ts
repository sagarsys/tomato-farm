import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSvgr } from "@rsbuild/plugin-svgr";
import path from "path";

export default defineConfig({
  plugins: [pluginReact(), pluginSvgr()],
  html: {
    template: "./public/index.html",
  },
  output: {
    distPath: {
      root: "build",
    },
  },
  source: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
