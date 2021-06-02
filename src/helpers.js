import fs from "fs";
import path from "path";

export function getPackageManager(options) {
  const managers = {
    yarn: {
      name: "yarn",
      commands: ["add", "--dev"],
    },
    npm: {
      name: "npm",
      commands: ["i", "-D"],
    },
  };

  return managers[options.manager];
}

export function saveDataFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function readDataFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath));
}

export function detectPackageManager(options, callback) {
  const dir = options.targetDirectory;
  const yarn = fileExists(path.resolve(dir, "yarn.lock"));
  const npm = fileExists(path.resolve(dir, "package-lock.json"));

  if (yarn && npm)
    return callback({
      detected: null,
      error:
        "Multiple package managers detected for project. Which package manager be used for installing dependencies to this project?",
    });

  if (yarn) return callback({ detected: "yarn", error: null });
  if (npm) return callback({ detected: "npm", error: null });

  return callback({
    detected: null,
    error:
      "Unable to detect package manager to for project. Which package manager be used for installing dependencies to this project?",
  });
}

function fileExists(filePath) {
  try {
    if (fs.existsSync(filePath)) return true;
    return false;
  } catch (err) {
    return false;
  }
}
