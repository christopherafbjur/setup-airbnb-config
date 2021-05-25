import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import execa from "execa";
import Listr from "listr";
import { projectInstall } from "pkg-install";

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
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

  const tasks = new Listr([
    {
      title: "Copy project files",
      task: () => copyTemplateFiles(options),
    },
    {
      title: "Configure user settings",
      task: () => buildDynamicFiles(options),
    },
    {
      title: "Initialize git",
      task: () => initializeGit(options),
      enabled: () => options.git,
    },
    {
      title: "Install dependencies",
      task: () =>
        projectInstall({
          cwd: options.targetDirectory,
        }),
    },
    {
      title: "Install eslint config (JS)",
      task: () => installEslintConfigJs(options),
      enabled: () => options.template.toLowerCase() === "javascript",
    },
    {
      title: "Install eslint config (React)",
      task: () => installEslintConfigReact(options),
      enabled: () => options.template.toLowerCase() === "react",
    },
  ]);

  await tasks.run();
  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
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

async function installEslintConfigJs(options) {
  const result = await execa(
    "npx",
    ["install-peerdeps", "--dev", "eslint-config-airbnb-base"],
    {
      cwd: options.targetDirectory,
    }
  );
  if (result.failed) {
    return Promise.reject(new Error("Failed to install eslint config"));
  }
  return;
}
async function installEslintConfigReact(options) {
  const result = await execa(
    "npx",
    ["install-peerdeps", "--dev", "eslint-config-airbnb"],
    {
      cwd: options.targetDirectory,
    }
  );
  if (result.failed) {
    return Promise.reject(new Error("Failed to install eslint config"));
  }
  return;
}

function buildDynamicFiles(options) {
  //TODO Add support for different data config depending on options.template
  buildPackageJson(options);
  buildEslintRcJson(options);
  buildPrettierRcJson(options);
}

function buildPackageJson(options) {
  const fullPath = path.resolve(options.targetDirectory, "package.json");
  const data = {
    name: "create-project-javascript-template",
    version: "1.0.0",
    description: "",
    main: "index.js",
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
    },
    keywords: [],
    author: "Christopher Af Bjur",
    license: "ISC",
    devDependencies: {
      eslint: "^7.27.0",
      "eslint-config-node": "^4.1.0",
      "eslint-config-prettier": "^8.3.0",
      "eslint-plugin-node": "^11.1.0",
      "eslint-plugin-prettier": "^3.4.0",
      prettier: "^2.3.0",
    },
  };

  saveDataFile(fullPath, data);
}

function buildEslintRcJson(options) {
  const fullPath = path.resolve(options.targetDirectory, ".eslintrc.json");
  const data = {
    extends: ["airbnb-base", "prettier", "plugin:node/recommended"],
    plugins: ["prettier"],
    rules: {
      "prettier/prettier": "error",
      "no-unused-vars": "warn",
      "no-console": "off",
      "func-names": "off",
      "no-process-exit": "off",
      "object-shorthand": "off",
      "class-methods-use-this": "off",
    },
  };

  saveDataFile(fullPath, data);
}

function buildPrettierRcJson(options) {
  const fullPath = path.resolve(options.targetDirectory, ".prettierrc.json");
  const data = {};

  saveDataFile(fullPath, data);
}

function saveDataFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
