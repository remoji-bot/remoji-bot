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

import { APIInteractionGuildMember } from "discord-api-types/v8";
import {
  CommandInteraction,
  DMChannel,
  Guild,
  GuildMember,
  NewsChannel,
  PartialDMChannel,
  Snowflake,
  TextChannel,
  ThreadChannel,
} from "discord.js";
import { inspect } from "util";
import { I18N } from "../../i18n";
import { EmbedUtil } from "../utils/EmbedUtil";
import { Ternary } from "@remoji-bot/core";
import { CommandOptionResolver } from "./CommandOptionResolver";
import { Bot } from "../Bot";

/**
 * Typing utility for guild interactions.
 */
export type GuildDependentInteraction<GUILD extends boolean> = CommandInteraction &
  Ternary<
    GUILD,
    {
      guild: Guild;
      guildID: Snowflake;
      member: GuildMember | APIInteractionGuildMember;
      channel: TextChannel | NewsChannel | ThreadChannel;
    },
    {
      guild: null;
      guildID: null;
      member: null;
      channel: DMChannel | PartialDMChannel;
    }
  >;

/**
 * Wraps a Slash Command interaction, providing useful methods and utilities.
 */
export class CommandContext<GUILD extends boolean = boolean> {
  readonly interaction: GuildDependentInteraction<GUILD>;
  readonly options: CommandOptionResolver;

  /**
   * Alias for `i18n`
   *
   * @returns the `I18N` instance.
   */
  get s(): I18N {
    return this.i18n;
  }

  constructor(readonly bot: Bot, interaction: GuildDependentInteraction<GUILD>, readonly i18n: I18N) {
    this.interaction = interaction;
    this.options = new CommandOptionResolver(interaction.options);
  }

  /**
   * Checks if the context is from a guild interaction.
   *
   * @returns whether this is a guild interaction
   */
  isGuild(): this is CommandContext<true> {
    return this.interaction.guild !== null;
  }

  /**
   * Returns whether the interaction user has voted on top.gg.
   *
   * @returns whether the interaction user has voted
   */
  async isVoter(): Promise<boolean> {
    const bot = Bot.getInstance();
    return await bot.topgg.hasVoted(this.interaction.user.id);
  }

  /**
   * Sends a base embed.
   *
   * @param message - The content of the embed
   * @param ephemeral - Whether to send an ephemeral message
   */
  async send(message: string, ephemeral = false): Promise<void> {
    await this.interaction.reply({ embeds: [EmbedUtil.base(this.i18n).setDescription(message)], ephemeral });
  }

  /**
   * Sends an error embed using `EmbedBuilder`.
   *
   * @param message - The content of the error message
   */
  async error(message: string): Promise<void> {
    await this.interaction.reply({ embeds: [EmbedUtil.error(this.i18n, message)] });
  }

  /**
   * Sends a success embed using `EmbedBuilder`.
   *
   * @param message - The content of the success message
   */
  async success(message: string): Promise<void> {
    await this.interaction.reply({ embeds: [EmbedUtil.success(this.i18n, message)] });
  }

  /**
   * FOR TESTING ONLY - Sends a debug reply.
   *
   * @deprecated
   * @param value - The value to send
   */
  async debug(value: unknown): Promise<void> {
    await this.interaction.reply({
      embeds: [EmbedUtil.base(this.i18n).setDescription("```js\n" + inspect(value).slice(0, 4000) + "\n```")],
    });
  }
}
