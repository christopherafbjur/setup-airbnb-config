import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import execa from "execa";
import Listr from "listr";

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
    filter: (path) => {
      const regex = /.*(.prettierrc.json|.eslintrc.json|package.json)$/i;
      const skip = regex.test(path);

      if (skip) return false;
      return true;
    },
  });
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    "../../templates",
    options.template.toLowerCase()
  );
  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error("%s Invalid template name", chalk.red.bold("ERROR"));
    process.exit(1);
  }

  const tasks = getTasks(options);

  await tasks.run();
  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
}

function getTasks(options) {
  const template = options.template.toLowerCase();

  if (template === "react") return getReactTasks(options);
  return getVanillaJsTasks(options);
}

function getReactTasks(options) {
  return new Listr([
    {
      title: "Create react app",
      task: async () => {
        const result = await execa(
          "npx",
          ["create-react-app@^4.0.3", ".", "--use-npm"],
          {
            cwd: options.targetDirectory,
          }
        );
        if (result.failed) {
          return Promise.reject(new Error("Failed to install react"));
        }
        return;
      },
    },
    {
      title: "Copy project files",
      task: () => copyTemplateFiles(options),
    },
    {
      title: "Configure user settings",
      task: () => {
        /* buildPackageJson(options); */ //TODO decide how we should mod package.json since it's being created by create-react-app
        buildEslintRcJson(options);
        buildPrettierRcJson(options);
      },
    },
    {
      title: "Install eslint/prettier deps",
      task: async () => {
        const dependencies = [
          "eslint@^7.27.0",
          "prettier@^2.3.0",
          "eslint-plugin-prettier@^3.4.0",
          "eslint-config-prettier@^8.3.0",
          "eslint-plugin-node@^11.1.0",
          "eslint-config-node@^4.1.0",
        ];

        const result = await execa("npm", ["i", "-D", ...dependencies], {
          cwd: options.targetDirectory,
        });
        if (result.failed) {
          return Promise.reject(new Error("Failed to install dependencies"));
        }
        return;
      },
    },
    {
      title: "Install eslint config (React)",
      task: async () => {
        const result = await execa(
          "npx",
          ["install-peerdeps", "--dev", "eslint-config-airbnb@^18.2.1"],
          {
            cwd: options.targetDirectory,
          }
        );
        if (result.failed) {
          return Promise.reject(new Error("Failed to install eslint config"));
        }
        return;
      },
    },
    /* {
      title: "Initialize git",
      task: () => initializeGit(options),
      enabled: () => options.git,
    }, */
  ]);
}

function getVanillaJsTasks(options) {
  return new Listr([
    {
      title: "Copy project files",
      task: () => copyTemplateFiles(options),
    },
    {
      title: "Configure user settings",
      task: () => {
        buildPackageJson(options);
        buildEslintRcJson(options);
        buildPrettierRcJson(options);
      },
    },
    {
      title: "Install eslint/prettier deps",
      task: async () => {
        const dependencies = [
          "eslint@^7.27.0",
          "prettier@^2.3.0",
          "eslint-plugin-prettier@^3.4.0",
          "eslint-config-prettier@^8.3.0",
          "eslint-plugin-node@^11.1.0",
          "eslint-config-node@^4.1.0",
        ];

        const result = await execa("npm", ["i", "-D", ...dependencies], {
          cwd: options.targetDirectory,
        });
        if (result.failed) {
          return Promise.reject(new Error("Failed to install dependencies"));
        }
        return;
      },
    },
    {
      title: "Install eslint config (JS)",
      task: async () => {
        const result = await execa(
          "npx",
          ["install-peerdeps", "--dev", "eslint-config-airbnb-base@^14.2.1"],
          {
            cwd: options.targetDirectory,
          }
        );
        if (result.failed) {
          return Promise.reject(new Error("Failed to install eslint config"));
        }
        return;
      },
    },
    /* {
      title: "Initialize git",
      task: () => initializeGit(options),
      enabled: () => options.git,
    }, */
  ]);
}

async function initializeGit(options) {
  const result = await execa("git", ["init"], {
    cwd: options.targetDirectory,
  });
  if (result.failed) {
    return Promise.reject(new Error("Failed to initialize git repo"));
  }
  return;
}

function buildPackageJson(options) {
  const inputPath = path.resolve(options.templateDirectory, "package.json");
  const outputPath = path.resolve(options.targetDirectory, "package.json");
  const data = readDataFile(inputPath);

  data.name = options.projectName;
  data.author = options.author;

  saveDataFile(outputPath, data);
}

function buildEslintRcJson(options) {
  const inputPath = path.resolve(options.templateDirectory, ".eslintrc.json");
  const outputPath = path.resolve(options.targetDirectory, ".eslintrc.json");
  const data = readDataFile(inputPath);

  //Mutate user options here

  saveDataFile(outputPath, data);
}

function buildPrettierRcJson(options) {
  const inputPath = path.resolve(options.templateDirectory, ".prettierrc.json");
  const outputPath = path.resolve(options.targetDirectory, ".prettierrc.json");
  const data = readDataFile(inputPath);

  //Mutate user options here

  saveDataFile(outputPath, data);
}

function saveDataFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function readDataFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath));
}
