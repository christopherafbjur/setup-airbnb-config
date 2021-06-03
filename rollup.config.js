import { terser } from "rollup-plugin-terser";

export default [
  {
    input: "./src/main.js",
    output: {
      file: "./build/bundle.min.js",
      format: "es",
      name: "mainBundle",
    },
    plugins: [
      /* terser() */
    ],
  },
  {
    input: "./src/cli.js",
    output: {
      file: "./build/cli.min.js",
      format: "es",
      name: "cliBundle",
    },
    plugins: [
      /* terser() */
    ],
  },
];
