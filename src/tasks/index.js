import Listr from "listr";
import copyProjectFiles from "./copyProjectFiles";
import configureUserSettings from "./configureUserSettings";
import installDependencies from "./installDependencies";
import installPeerDependencies from "./installPeerDependencies";
import addFormatOnSave from "./addFormatOnSave";

export function getTasks(options) {
  return new Listr([
    addFormatOnSave(options),
    copyProjectFiles(options),
    configureUserSettings(options),
    installDependencies(options),
    installPeerDependencies(options),
  ]);
}
