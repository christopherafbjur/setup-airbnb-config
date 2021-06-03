import arg from "arg";
import chalk from "chalk";
import inquirer from "inquirer";
import { createProject } from "./main";
import { detectPackageManager } from "./helpers";
import { packageJsonExists } from "./helpers";

function parseArgsIntoOptions(rawArgs, options) {
  let args;
  try {
    args = arg(
      {
        "--yarn": Boolean,
        "--npm": Boolean,
        "--react": Boolean,
        "--javascript": Boolean,
        "-j": "--javascript",
        "-r": "--react",
      },
      {
        argv: rawArgs.slice(2),
      }
    );
  } catch (err) {
    console.error("%s ".concat(err.message), chalk.red.bold("ERROR "));
    process.exit(1);
  }

  return {
    ...options,
    template: (function () {
      if (args["--react"]) return "react";
      if (args["--javascript"]) return "javascript";

      return null;
    })(),
    manager: (function () {
      if (args["--npm"]) return "npm";
      if (args["--yarn"]) return "yarn";

      return null;
    })(),
  };
}

function createOptions() {
  return {
    targetDirectory: process.cwd(),
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = "javascript";
  const defaultManager = "npm";

  const questions = [];

  if (!options.manager) {
    detectPackageManager(options, ({ detected, error }) => {
      if (detected) {
        options.manager = detected;
      } else {
        questions.push({
          type: "list",
          name: "manager",
          choices: ["npm", "yarn"],
          message: error,
          default: defaultManager,
        });
      }
    });
  }

  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose what type of project this is",
      choices: [
        { name: "JavaScript", value: "javascript" },
        { name: "React", value: "react" },
      ],
      default: defaultTemplate,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    manager: options.manager || answers.manager,
  };
}

export async function cli(args) {
  let options = createOptions();

  if (!packageJsonExists(options)) {
    console.error("%s Missing package.json.", chalk.red.bold("ERROR "));
    process.exit(1);
  }

  options = parseArgsIntoOptions(args, options);
  options = await promptForMissingOptions(options);

  await createProject(options);
}
