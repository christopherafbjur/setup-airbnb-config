import execa from "execa";
import { getPackageManager } from "../helpers";

function getTemplatePeerDeps(template) {
  const dependencies = ["eslint@^7.2.0", "eslint-plugin-import@^2.22.1"];
  const reactDeps = [
    "eslint-config-airbnb@^18.2.1",
    "eslint-plugin-jsx-a11y@^6.4.1",
    "eslint-plugin-react@^7.21.5",
    "eslint-plugin-react-hooks@^4",
  ];
  const jsDeps = ["eslint-config-airbnb-base@^14.2.1"];

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
  const template = options.template.toLowerCase();

  return {
    title: `Installing peer dependencies...`,
    task: async () => {
      const result = await execa(
        manager.name,
        [...manager.commands, ...getTemplatePeerDeps(template)],
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
