/*
  Remoji - Discord emoji manager bot
  Copyright (C) 2021 Shino <shinotheshino@gmail.com>.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import eris from "eris";
import child_process from "child_process";

const Constants = Object.freeze({
  supportServerInvite: "https://discord.gg/WhbncjXPXN",
  topGG: "https://top.gg/bot/781606551349231667",
  requiredPermissions:
    eris.Constants.Permissions.manageEmojis |
    eris.Constants.Permissions.readMessages |
    eris.Constants.Permissions.readMessageHistory |
    eris.Constants.Permissions.externalEmojis,
  version: "2.0.0",
  git: Object.freeze({
    branch: child_process.execSync("git rev-parse --abbrev-ref HEAD").toString("utf8").trim(),
    commit: child_process.execSync("git rev-parse --short HEAD").toString("utf8").trim(),
  }),
  stati: [
    {
      type: 5 as eris.BotActivityType,
      name: "/info (slash commands)",
    },
  ] as eris.ActivityPartial<eris.BotActivityType>[],
  imageDomainWhitelist: ["i.imgur.com", "cdn.discordapp.com"],
});

export default Constants;
