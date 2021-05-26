import chalk from "chalk";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { getTasks } from "./tasks";

const access = promisify(fs.access);

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
