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

import * as discord from "discord.js";
import { PingCommand } from "../commands/core/ping.command";
import { UploadCommand } from "../commands/core/upload.command";
import { CommandContext } from "./base/commandcontext";
import { CommandManager } from "./base/commandmanager";
import { RedisConnection } from "./data/redis/redisconnection";
import { Logger } from "./logger";

import { TopGGInterface } from "./third-party/topgginterface";
import { getenv } from "./utils/functions";

/**
 * The Bot singleton class.
 */
export class Bot {
  private static instance: Bot;

  /**
   * Returns the singleton instance, creating one if needed.
   *
   * @returns the singleton instance
   */
  public static getInstance(): Bot {
    if (!this.instance) this.instance = new this();
    return this.instance;
  }

  readonly client: discord.Client;
  readonly topgg = TopGGInterface.getInstance();
  readonly commands = new CommandManager();

  private constructor() {
    this.client = new discord.Client({
      allowedMentions: { parse: [] },
      intents: ["GUILDS", "GUILD_EMOJIS"],
      shards: "auto",
      rejectOnRateLimit: data => data.global,
    });

    this.client.on("interaction", this.handleInteraction.bind(this));
  }

  /**
   * Start the bot.
   */
  async connect(): Promise<void> {
    Logger.info("Connecting to Redis...");
    await RedisConnection.getInstance().redis.ping();
    Logger.info("Connecting to Discord...");
    await this.client.login(getenv("DISCORD_TOKEN", false, true));
    Logger.info(`Connected as ${this.client.user?.tag} with ${this.client.shard?.count ?? 1} shard(s)`);

    this.commands.register(new PingCommand()).register(new UploadCommand());
    // TODO.. :)

    await Promise.all(
      this.commands.commands.mapValues(command => this.client.application?.commands.create(command.data)),
    );
    await Promise.all(
      this.commands.commands.mapValues(async command => {
        const guild = await this.client.guilds.fetch(getenv("COMMAND_TESTING_GUILD", false, true) as discord.Snowflake);
        await guild.commands.create(command.data);
      }),
    );
    Logger.info("Registered commands!");
  }

  /**
   * Handle an interaction event.
   *
   * @param interaction - The interaction to handle.
   */
  private async handleInteraction(interaction: discord.Interaction): Promise<void> {
    if (interaction.isCommand()) {
      const command = this.commands.get(interaction.commandName);
      if (command) await command["_run"](new CommandContext(interaction));
    } else if (interaction.isButton()) {
      // TODO
    } else if (interaction.isSelectMenu()) {
      // TODO
    }
  }
}
