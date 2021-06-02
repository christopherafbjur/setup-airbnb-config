import execa from "execa";

function getTemplateDependency(template) {
  const dependencies = ["eslint@^7.2.0", "eslint-plugin-import@^2.22.1"];
  const reactDeps = [
    "eslint-plugin-jsx-a11y@^6.4.1",
    "eslint-plugin-react@^7.21.5",
    "eslint-plugin-react-hooks@^4",
  ];

  if (template === "react") {
    reactDeps.forEach((reactDep) => dependencies.push(reactDep));
  }
  return dependencies;
}
export default function (options) {
  const template = options.template.toLowerCase();

  return {
    title: `Install Peer Dependencies (${template})`,
    task: async () => {
      const result = await execa(
        "npm",
        ["i", "-D", getTemplateDependency(template)],
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
