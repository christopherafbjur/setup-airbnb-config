import path from "path";
import { readDataFile, saveDataFile } from "../helpers";

export default function (options) {
  return {
    title: "Configure user settings",
    task: () => {
      buildEslintRcJson(options);
      buildPrettierRcJson(options);
    },
  };
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
