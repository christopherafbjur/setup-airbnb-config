import { promisify } from "util";
import ncp from "ncp";

async function copyTemplateFiles(options) {
  const copy = promisify(ncp);

  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
    filter: (path) => {
      const regex = /.*(.prettierrc.json|.eslintrc.json)$/i;
      const skip = regex.test(path);

      if (skip) return false;
      return true;
    },
  });
}

export default function (options) {
  return {
    title: "Copy project files",
    task: () => copyTemplateFiles(options),
  };
}
