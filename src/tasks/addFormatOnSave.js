import fs from "fs";
import path from "path";
import { fileExists, readDataFile, saveDataFile } from "../utils/helpers";

export default function addFormatOnSave(options) {
  return {
    title: "Setup local formatOnSave setting",
    task: () => {
      createVscodeFolder(options);
      updateSettingsJson(options);
    },
  };
}

function createVscodeFolder(options) {
  const folderPath = path.resolve(options.targetDirectory, ".vscode");
  const vscodeFolderExists = fileExists(folderPath);

  if (!vscodeFolderExists) {
    fs.mkdirSync(folderPath);
  }
}

function updateSettingsJson(options) {
  const settingsPath = path.resolve(
    options.targetDirectory,
    ".vscode",
    "settings.json"
  );
  const settingsExists = fileExists(settingsPath);
  let settingsFile = null;

  if (settingsExists) {
    settingsFile = readDataFile(settingsPath);
    settingsFile["editor.formatOnSave"] = true;
  } else {
    settingsFile = {
      "editor.formatOnSave": true,
    };
  }
  saveDataFile(settingsPath, settingsFile);
}
