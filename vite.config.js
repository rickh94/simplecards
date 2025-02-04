// vite.config.js / vite.config.ts
import { viteStaticCopy } from "vite-plugin-static-copy";

export default {
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "public/*",
          dest: "./",
        },
      ],
    }),
  ],
};
