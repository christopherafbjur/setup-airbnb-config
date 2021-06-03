import fs from "fs";
import path from "path";
import { fileExists, readDataFile, saveDataFile } from "../helpers";

export default function addFormatOnSave(options) {
  console.log("FILE EXISTS IS", fileExists);
  return {
    title: "Setup local formatOnSave setting...",
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

  console.log("vscodeFolderExists", vscodeFolderExists);
  console.log("folderPath", folderPath);
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
    //Modify current file
    console.log("modified settings.json");
    settingsFile = readDataFile(settingsPath);
    console.log("settingsFile is", settingsFile);
    settingsFile["editor.formatOnSave"] = true;
  } else {
    console.log("created settings.json");
    settingsFile = {
      "editor.formatOnSave": true,
    };
    console.log("settingsFile is", settingsFile);
  }
  saveDataFile(settingsPath, settingsFile);
}
