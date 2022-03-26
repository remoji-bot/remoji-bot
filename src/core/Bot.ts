/*
  Remoji - Discord emoji manager bot
  Copyright (C) 2022 Memikri <memikri1@gmail.com>.

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

import { Logger } from "@remoji-bot/core";
import * as discord from "discord.js";

import { CommandContext, GuildDependentInteraction } from "./base/CommandContext";
import { CommandManager } from "./base/CommandManager";
import { RedisConnection } from "./data/redis/RedisConnection";
import { RedisStore } from "./data/redis/RedisStore";
import { TopGGInterface } from "./third-party/TopGGInterface";
import Constants from "./utils/Constants";
import { API } from "../api/API";
import { LanguageCommand } from "../commands/core/language.command";
import { PingCommand } from "../commands/core/ping.command";
import { APICommand } from "../commands/dev/api.command";
import { I18NCovCommand } from "../commands/dev/i18ncov.command";
import { CopyCommand } from "../commands/emotes/copy.command";
import { InfoCommand } from "../commands/emotes/info.command";
import { UploadCommand } from "../commands/emotes/upload.command";
import environment from "../environment";
import { I18N, I18NLanguage } from "../i18n";

/**
 * The Bot singleton class.
 */
export class Bot {
  private static instance: Bot | null = null;

  /**
   * Returns the singleton instance, creating one if needed.
   *
   * @returns the singleton instance
   */
  public static getInstance(): Bot {
    if (!this.instance) this.instance = new this();
    return this.instance;
  }

  public readonly logger = Logger.getLogger("bot");

  public readonly client: discord.Client<true>;
  public readonly topgg = TopGGInterface.getInstance();
  public readonly commands = new CommandManager();
  public readonly api = API.getInstance();

  public readonly constants = Constants;

  public readonly i18nUserStore = new RedisStore<discord.Snowflake, I18NLanguage>("i18nUser");

  private constructor() {
    this.client = new discord.Client({
      allowedMentions: { parse: [] },
      intents: ["GUILDS", "GUILD_EMOJIS_AND_STICKERS"],
      shards: "auto",
      rejectOnRateLimit: data => data.global,
    });

    this.client.on("interactionCreate", this.handleInteraction.bind(this));
  }

  /**
   * Start the bot.
   */
  public async connect(): Promise<void> {
    this.logger.info("Connecting to Redis...");
    await RedisConnection.getInstance().redis.ping();
    this.logger.info("Connecting to Discord...");
    await this.client.login(environment.DISCORD_TOKEN);
    this.logger.info(`Connected as ${this.client.user.tag} with ${this.client.shard?.count ?? 1} shard(s)`);
    await this.api.start();

    this.commands
      .register(new APICommand())
      .register(new I18NCovCommand())
      .register(new PingCommand())
      .register(new UploadCommand())
      .register(new LanguageCommand())
      .register(new CopyCommand())
      .register(new InfoCommand());

    const applicationCommands = await this.client.application.commands.fetch();

    // Remove all unregistered commands
    for (const [, command] of applicationCommands) {
      if (!this.commands.get(command.name)) {
        this.logger.verbose(`Unregistered command: ${command.name}`);
        await command.delete();
      }
    }

    if (environment.NODE_ENV === "development") {
      this.logger.info("Removing production commands from testing bot");
      await this.client.application.commands.set([]);
      this.logger.info("Registering commands in testing guild...");
      await this.client.guilds
        .fetch(environment.TESTING_GUILD_ID)
        .then(guild => guild.commands.set(this.commands.commands.map(command => command.data)));
    } else {
      this.logger.info("Registering developer commands...");
      await this.client.guilds
        .fetch(environment.TESTING_GUILD_ID)
        .then(guild =>
          guild.commands.set(
            this.commands.commands
              .filter(command => command.options.developerOnly ?? false)
              .map(command => command.data),
          ),
        );
      this.logger.info("Registering global commands...");
      await this.client.application.commands.set(
        this.commands.commands.filter(command => !command.options.developerOnly).map(command => command.data),
      );
    }

    this.logger.info("Registered commands!");

    // Fetch application info for isDeveloper checks
    await this.client.application.fetch();
  }

  /**
   * Handle an interaction event.
   *
   * @param interaction - The interaction to handle.
   */
  private async handleInteraction(interaction: discord.Interaction): Promise<void> {
    const i18n = await this.getI18N(interaction.user.id);
    if (interaction.isCommand()) {
      const command = this.commands.get(interaction.commandName);
      if (command) {
        this.logger.verbose(
          `User ${interaction.user.tag} (${interaction.user.id}) ran command: /${
            command.data.name
          } with options: ${JSON.stringify(interaction.options.data)}, guild: ${
            interaction.guildId ?? "N/A"
          }, channel: ${interaction.channelId}, interaction: ${interaction.id}`,
        );
        await command["_run"](new CommandContext(this, interaction as GuildDependentInteraction<boolean>, i18n));
      } else {
        // Remove the command as it is not registered
        await interaction.command?.delete();
        await interaction.reply({ content: i18n.unknown_command(interaction.commandName), ephemeral: true });
      }
    } else if (interaction.isButton()) {
      // TODO : Handle buttons using button commands for interactions
    } else if (interaction.isSelectMenu()) {
      // TODO : Handle select menus using select menu commands for interactions
    }
  }

  /**
   * Returns whether the given user is a bot developer.
   *
   * @param userId - The user ID to check.
   * @returns Whether the given user is a bot developer.
   */
  public isDeveloper(userId: discord.Snowflake): boolean {
    // Allow override in development environment
    if (environment.NODE_ENV === "development" && environment.DEVELOPER_ID?.split(",").includes(userId)) return true;

    const owner = this.client.application.owner;

    if (owner instanceof discord.User) {
      return userId === owner.id;
    } else if (owner instanceof discord.Team) {
      return owner.members.has(userId);
    }

    throw new Error("Owner is not a User or Team");
  }

  /**
   * Get an i18n object for a specific user.
   *
   * @param user - The user ID for which to fetch preferred language
   * @returns The I18N object to use for translation
   */
  public async getI18N(user?: discord.Snowflake): Promise<I18N> {
    const userLanguage = user && (await this.i18nUserStore.get(user));
    const i18n =
      userLanguage && userLanguage in I18N.languages
        ? I18N.languages[userLanguage]
        : I18N.languages[I18N.defaultLanguage];
    return i18n;
  }
}
