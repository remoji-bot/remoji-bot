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
import { LanguageCommand } from "../commands/core/language.command";

import { PingCommand } from "../commands/core/ping.command";
import { CopyCommand } from "../commands/emotes/copy.command";
import { UploadCommand } from "../commands/emotes/upload.command";
import { I18N, I18NLanguage } from "../i18n";
import { Lang_cy_GB } from "../i18n/lang/cy-GB.lang";
import { Lang_de_DE } from "../i18n/lang/de-DE.lang";
import { Lang_en_US } from "../i18n/lang/en-US.lang";
import { Lang_nl_NL } from "../i18n/lang/nl-NL.lang";
import { CommandContext, GuildDependentInteraction } from "./base/CommandContext";
import { CommandManager } from "./base/CommandManager";
import { RedisConnection } from "./data/redis/RedisConnection";
import { RedisStore } from "./data/redis/RedisStore";
import { TopGGInterface } from "./third-party/TopGGInterface";
import { Logger } from "@remoji-bot/core";
import Constants from "./utils/Constants";
import { InfoCommand } from "../commands/emotes/info.command";
import { API } from "../api/API";
import environment from "../environment";
import { APICommand } from "../commands/dev/api.command";

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

  readonly logger = Logger.getLogger("bot");

  readonly client: discord.Client;
  readonly topgg = TopGGInterface.getInstance();
  readonly commands = new CommandManager();
  readonly api = API.getInstance();

  readonly constants = Constants;

  readonly i18n: Readonly<Record<I18NLanguage, I18N>> = Object.freeze({
    "cy-GB": new Lang_cy_GB(),
    "en-US": new Lang_en_US(),
    "nl-NL": new Lang_nl_NL(),
    "de-DE": new Lang_de_DE(),
  });
  readonly i18nUserStore = new RedisStore<discord.Snowflake, I18NLanguage>("i18nUser");

  private constructor() {
    this.client = new discord.Client({
      allowedMentions: { parse: [] },
      intents: ["GUILDS", "GUILD_EMOJIS"],
      shards: "auto",
      rejectOnRateLimit: data => data.global,
    });

    this.client.on("interactionCreate", this.handleInteraction.bind(this));
  }

  /**
   * Start the bot.
   */
  async connect(): Promise<void> {
    this.logger.info("Connecting to Redis...");
    await RedisConnection.getInstance().redis.ping();
    this.logger.info("Connecting to Discord...");
    await this.client.login(environment.DISCORD_TOKEN);
    this.logger.info(`Connected as ${this.client.user?.tag} with ${this.client.shard?.count ?? 1} shard(s)`);
    await this.api.start();

    this.commands
      .register(new APICommand())
      .register(new PingCommand())
      .register(new UploadCommand())
      .register(new LanguageCommand())
      .register(new CopyCommand())
      .register(new InfoCommand());

    const applicationCommands = await this.client.application?.commands.fetch();

    // Remove all unregistered commands
    for (const [, command] of applicationCommands ?? []) {
      if (!this.commands.get(command.name)) {
        this.logger.verbose(`Unregistered command: ${command.name}`);
        await command.delete();
      }
    }

    if (environment.NODE_ENV === "development") {
      this.logger.info("Removing production commands from testing bot");
      for (const [, command] of applicationCommands ?? []) {
        this.logger.verbose(`Remoing command: ${command.name}...`);
        await command.delete();
      }
      this.logger.info("Registering commands in testing guild...");
      await Promise.all(
        this.commands.commands.mapValues(async command => {
          const guild = await this.client.guilds.fetch(environment.TESTING_GUILD_ID as discord.Snowflake);
          await guild.commands.create(command.data);
        }),
      );
    } else {
      this.logger.info("Registering developer commands...");
      await Promise.all(
        this.commands.commands
          .filter(command => !!command.options.developerOnly)
          .mapValues(async command => {
            const guild = await this.client.guilds.fetch(environment.TESTING_GUILD_ID as discord.Snowflake);
            await guild.commands.create(command.data);
          }),
      );
      this.logger.info("Registering global commands...");
      await Promise.all(
        this.commands.commands
          .filter(command => !command.options.developerOnly)
          .mapValues(async command => {
            await this.client.application?.commands.create(command.data);
          }),
      );
    }

    this.logger.info("Registered commands!");
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
          } with options: ${JSON.stringify(interaction.options.toJSON())}, guild: ${interaction.guildId}, channel: ${
            interaction.channelId
          }, interaction: ${interaction.id}`,
        );
        await command["_run"](new CommandContext(this, interaction as GuildDependentInteraction<boolean>, i18n));
      } else {
        // Remove the command as it is not registered
        await interaction.command?.delete();
        await interaction.reply({ content: i18n.commands.unknown(interaction.commandName), ephemeral: true });
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
  isDeveloper(userId: discord.Snowflake): boolean {
    // Allow override in development environment
    if (environment.NODE_ENV === "development" && environment.DEVELOPER_ID?.split(",").includes(userId)) return true;

    const application = this.client.application;
    const owner = application?.owner;

    if (application && owner) {
      if (owner instanceof discord.User) {
        return userId === owner.id;
      } else if (owner instanceof discord.Team) {
        return owner.members.has(userId);
      } else {
        throw new Error("Owner is not a User or Team");
      }
    } else {
      this.logger.warn("isDeveloper: Application and/or owner is null");
      return false;
    }
  }

  /**
   * Get an i18n object for a specific user.
   *
   * @param user - The user ID for which to fetch preferred language
   * @returns The I18N object to use for translation
   */
  async getI18N(user?: discord.Snowflake): Promise<I18N> {
    const userLanguage = user && (await this.i18nUserStore.get(user));
    const i18n = userLanguage && userLanguage in this.i18n ? this.i18n[userLanguage] : this.i18n["en-US"];
    return i18n;
  }
}
