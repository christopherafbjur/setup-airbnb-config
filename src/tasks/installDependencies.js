import execa from "execa";
import { getPackageManager } from "../helpers";

export default function (options) {
  const manager = getPackageManager(options);
  const dependencies = [
    "prettier@^2.3.0",
    "eslint-plugin-prettier@^3.4.0",
    "eslint-config-prettier@^8.3.0",
  ];
  const jsDeps = ["eslint-plugin-node@^11.1.0", "eslint-config-node@^4.1.0"];

  if (options.template === "javascript") {
    jsDeps.forEach((jsDep) => dependencies.push(jsDep));
  }

  return {
    title: "Installing dependencies...",
    task: async () => {
      const result = await execa(
        manager.name,
        [...manager.commands, ...dependencies],
        {
          cwd: options.targetDirectory,
        }
      );
      if (result.failed) {
        return Promise.reject(new Error("Failed to install dependencies"));
      }
      return;
    },
  };
}
