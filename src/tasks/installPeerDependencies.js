import execa from "execa";
import { getPackageManager } from "../utils/helpers";

function getTemplatePeerDeps({ template }) {
  const dependencies = ["eslint@^8.7.0", "eslint-plugin-import@^2.25.4"];
  const reactDeps = [
    "eslint-config-airbnb@^19.0.4",
    "eslint-plugin-jsx-a11y@^6.5.1",
    "eslint-plugin-react@^7.28.0",
    "eslint-plugin-react-hooks@^4.3.0",
  ];
  const jsDeps = ["eslint-config-airbnb-base@^15.0.0"];

  if (template === "react") {
    reactDeps.forEach((reactDep) => dependencies.push(reactDep));
  }
  if (template === "javascript") {
    jsDeps.forEach((jsDep) => dependencies.push(jsDep));
  }

  return dependencies;
}
export default function (options) {
  const manager = getPackageManager(options);

  return {
    title: `Installing peer dependencies...`,
    task: async () => {
      const result = await execa(
        manager.name,
        [...manager.commands, ...getTemplatePeerDeps(options)],
        {
          cwd: options.targetDirectory,
        }
      );
      if (result.failed) {
        return Promise.reject(
          new Error("Failed to install peer dependencies.")
        );
      }
      return;
    },
  };
}
