import execa from "execa";

export default function (options) {
  const dependencies = [
    "eslint@^7.27.0",
    "prettier@^2.3.0",
    "eslint-plugin-prettier@^3.4.0",
    "eslint-config-prettier@^8.3.0",
    "eslint-plugin-node@^11.1.0",
    "eslint-config-node@^4.1.0",
  ];

  return {
    title: "Install eslint/prettier deps",
    task: async () => {
      const result = await execa("npm", ["i", "-D", ...dependencies], {
        cwd: options.targetDirectory,
      });
      if (result.failed) {
        return Promise.reject(new Error("Failed to install dependencies"));
      }
      return;
    },
  };
}