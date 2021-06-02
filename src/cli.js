import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";

function parseArgsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--yes": Boolean,
      "--git": Boolean,
      "--yarn": Boolean,
      "-y": "--yes",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    useYarn: args["--yarn"] || false,
    skipPrompts: args["--yes"] || false,
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
      message: "Please choose what type of project this is",
      choices: ["JavaScript", "React"],
      default: defaultTemplate,
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
