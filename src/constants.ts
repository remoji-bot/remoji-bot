import eris from "eris";
import child_process from "child_process";

const Constants = Object.freeze({
  supportServerInvite: "https://discord.gg/WhbncjXPXN",
  requiredPermissions:
    eris.Constants.Permissions.manageEmojis |
    eris.Constants.Permissions.readMessages |
    eris.Constants.Permissions.sendMessages |
    eris.Constants.Permissions.embedLinks |
    eris.Constants.Permissions.attachFiles |
    eris.Constants.Permissions.externalEmojis,
  version: "1.0.0",
  git: Object.freeze({
    branch: child_process.execSync("git rev-parse --abbrev-ref HEAD").toString("utf8").trim(),
    commit: child_process.execSync("git rev-parse --short HEAD").toString("utf8").trim(),
  }),
});
export default Constants;
