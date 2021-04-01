import { Bot } from "./lib/bot";
import { Constants as ErisConstants } from "eris";
import { PingCommand } from "./commands/ping.command";
import logger from "./lib/logger";
import dotenv from "dotenv-safe";
import { HelpCommand } from "./commands/help.command";
import { randomChoice } from "./lib/utils";
import Constants from "./Constants";
import { CopyCommand } from "./commands/copy.command";

const { Intents } = ErisConstants;

dotenv.config({ allowEmptyValues: true });

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

bot.addCommand(new PingCommand()).addCommand(new HelpCommand()).addCommand(new CopyCommand());

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
