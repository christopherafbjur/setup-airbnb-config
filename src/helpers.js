import fs from "fs";

export function getPackageManager(options) {
  if (options.useYarn)
    return {
      name: "yarn",
      commands: ["add", "--dev"],
    };

  return {
    name: "npm",
    commands: ["i", "-D"],
  };
}

export function saveDataFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function readDataFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath));
}
