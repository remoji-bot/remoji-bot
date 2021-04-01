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
import dotenv from "dotenv-safe";
dotenv.config({ allowEmptyValues: true });

import { Bot } from "./lib/bot";
import { Constants as ErisConstants } from "eris";
import { PingCommand } from "./commands/ping.command";
import logger from "./lib/logger";
import { HelpCommand } from "./commands/help.command";
import { randomChoice } from "./lib/utils";
import Constants from "./Constants";
import { CopyCommand } from "./commands/copy.command";
import { DownloadCommand } from "./commands/download.command";
import { UploadCommand } from "./commands/upload.command";
import { ListCommand } from "./commands/list.command";

const { Intents } = ErisConstants;

const bot = new Bot({
  token: process.env.DISCORD_TOKEN as string,
  erisOptions: {
    intents: Intents.guilds | Intents.guildMessages | Intents.guildMessageReactions | Intents.guildEmojis,
    allowedMentions: {
      everyone: false,
      roles: false,
      users: true,
    },
  },
});

bot
  .addCommand(new PingCommand())
  .addCommand(new HelpCommand())
  .addCommand(new CopyCommand())
  .addCommand(new DownloadCommand())
  .addCommand(new UploadCommand())
  .addCommand(new ListCommand());

async function main() {
  await bot.login();
  logger.info("Logged in!");

  function editStatus() {
    bot.client.editStatus("online", randomChoice(Constants.stati));
  }

  setInterval(editStatus, 1000 * 60 * 5).unref();
  editStatus();
}

void main();
