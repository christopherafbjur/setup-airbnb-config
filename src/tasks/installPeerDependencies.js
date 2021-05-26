import execa from "execa";

function getTemplateDependency(template) {
  if (template === "react") return "eslint-config-airbnb@^18.2.1";
  return "eslint-config-airbnb-base@^14.2.1";
}
export default function (options) {
  const template = options.template.toLowerCase();

  return {
    title: `Install Peer Dependencies (${template})`,
    task: async () => {
      const result = await execa(
        "npx",
        ["install-peerdeps", "--dev", getTemplateDependency(template)],
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
