import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";
import { peerDependencies } from "./package.json";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "dinglan-ui",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies)],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [dts()], // 生成.d.ts文件
});
