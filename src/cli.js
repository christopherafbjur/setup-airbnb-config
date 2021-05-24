import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";

function parseArgsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--test": Boolean,
      "--yes": Boolean,
      "--git": Boolean,
      "--install": Boolean,
      "-t": "--test",
      "-y": "--yes",
      "-g": "--git",
      "-i": "--install",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    test: args["--test"] || false,
    git: args["--git"] || false,
    template: args._[0],
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = "JavaScript";
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }

  const questions = [];
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use",
      choices: ["JavaScript", "React"],
      default: defaultTemplate,
    });
  }

  if (!options.test) {
    questions.push({
      type: "confirm",
      name: "test",
      message: "This is a test",
      default: false,
    });
  }

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize git repo?",
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    test: options.test || answers.test,
  };
}

export async function cli(args) {
  let options = parseArgsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}
