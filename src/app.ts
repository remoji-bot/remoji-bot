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

import * as dotenv from "dotenv-safe";
dotenv.config();

import { AnyRequestData, GatewayServer, SlashCreator } from "slash-create";
import { inspect } from "util";

import Constants from "./Constants";
import { Bot } from "./lib/bot";
import { Logger } from "./lib/logger";
import { randomChoice } from "./lib/utils";

import CopyCommand from "./commands/copy.command";
import DownloadCommand from "./commands/download.command";
import InfoCommand from "./commands/info.command";
import ListCommand from "./commands/list.command";
import PingCommand from "./commands/ping.command";
import UploadCommand from "./commands/upload.command";

const bot = new Bot({
  token: process.env.DISCORD_TOKEN as string,
  erisOptions: {
    restMode: true,
  },
  topggToken: process.env.TOPGG_TOKEN as string,
});

const creator = new SlashCreator({
  applicationID: process.env.APPLICATION_ID as string,
  publicKey: process.env.CLIENT_PUBLIC_KEY as string,
  token: process.env.DISCORD_TOKEN as string,
  allowedMentions: {
    everyone: false,
    roles: false,
    users: false,
  },
});

creator.on("error", err => Logger.error(inspect(err)));
creator.on("commandError", (command, err, ctx) => Logger.error(inspect({ command, err, ctx })));
creator.on("commandRun", (command, _, ctx) => {
  Logger.info(
    JSON.stringify({
      command: command.commandName,
      guild: ctx.guildID,
      user: `${ctx.user.id} (${ctx.user.username}#${ctx.user.discriminator})`,
      options: ctx.options,
    }),
  );
});
creator.on("debug", message => Logger.verbose(message));

async function main() {
  await bot.login();
  creator
    .withServer(
      new GatewayServer(handler =>
        bot.client.on("rawWS", e => {
          if (e.t === "INTERACTION_CREATE") handler(e.d as AnyRequestData);
        }),
      ),
    )
    .registerCommand(CopyCommand)
    .registerCommand(DownloadCommand)
    .registerCommand(InfoCommand)
    .registerCommand(ListCommand)
    .registerCommand(PingCommand)
    .registerCommand(UploadCommand)
    .syncCommands({
      skipGuildErrors: true,
      deleteCommands: true,
    });

  Logger.info(`Logged in as ${bot.client.user.username}#${bot.client.user.discriminator} with ${creator.commands.size} commands.`);

  function editStatus() {
    const status = randomChoice(Constants.stati);
    Logger.verbose(`editStatus(): changing status to (${status.type}) "${status.name}"`);
    bot.client.editStatus("online", status);
  }

  setInterval(editStatus, 1000 * 60 * 60).unref();
  editStatus();
}

void main();
