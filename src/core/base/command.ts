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

import * as assert from "assert";
import * as discord from "discord.js";
import { Bot } from "../bot";
import { Logger } from "../logger";
import { getenv } from "../utils/functions";
import { Nullable } from "../utils/types";
import { CommandContext } from "./commandcontext";

export interface CommandOptions<GUILD extends boolean> {
  guildOnly: GUILD;

  developerOnly?: boolean;
  voterOnly?: boolean;
  premium?: boolean;

  userPermissions?: discord.PermissionResolvable;
  botPermissions?: discord.PermissionResolvable;
}

/**
 * The basic abstract class for all commands.
 */
export abstract class Command<GUILD extends boolean = boolean> {
  readonly data: Readonly<discord.ApplicationCommandData>;
  readonly bot = Bot.getInstance();

  private readonly options: Readonly<CommandOptions<GUILD>>;

  constructor(data: discord.ApplicationCommandData, options: CommandOptions<GUILD>) {
    Logger.verbose(`Constructed Command: ${data.name}`);
    this.data = data;
    this.options = options;
    assert(this._run === Command.prototype._run, "Command#_run must not be overridden");
  }

  /**
   * Checks for the given required permissions.
   *
   * @param required - The permissions to check for
   * @param given - The permissions that were supplied
   * @returns The missing permissions, if any, otherwise null
   */
  private _checkPermissions(
    required: Nullable<discord.PermissionResolvable>,
    given: Nullable<discord.PermissionResolvable>,
  ): Nullable<discord.Permissions> {
    const missing = new discord.Permissions(new discord.Permissions(given ?? 0n).missing(required ?? 0n));
    return missing.bitfield > 0 ? missing : null;
  }

  /**
   * Internal method for running a command. Marked private to disallow override.
   * Called via index accessor in interaction event.
   *
   * @param ctx - The context to execute
   * @returns void
   */
  private async _run(ctx: CommandContext<boolean>): Promise<void> {
    // TODO: check this.options.developerOnly

    if (this.options.guildOnly && !ctx.interaction.guild) {
      Logger.error(`guildOnly command ${this.data.name} was run outside of a guild`);
      await ctx.error(`:x: This command can only be used in a server!`);
      return;
    }

    // TODO: maybe use Promise.all, pass interaction and fetch members if needed in _checkPermissions
    const [missingPermsUser, missingPermsBot] = [
      ctx.interaction.guild &&
        this._checkPermissions(this.options.userPermissions ?? null, ctx.interaction.member?.permissions ?? null),
      ctx.interaction.guild &&
        this._checkPermissions(this.options.botPermissions ?? null, ctx.interaction.guild?.me?.permissions ?? null),
    ];

    if (missingPermsUser) {
      await ctx.error(
        `**You** need the following permissions to run this command:
        ${missingPermsUser
          .toArray()
          .map(perm => `\`${perm}\``)
          .join(", ")}`,
      );
      return;
    }

    if (missingPermsBot) {
      await ctx.error(
        `**Remoji** needs the following permissions to run this command:
        ${missingPermsBot
          .toArray()
          .map(perm => `\`${perm}\``)
          .join(", ")}`,
      );
      return;
    }

    if (this.options.voterOnly && !(await this.bot.topgg.hasVoted(ctx.interaction.user.id))) {
      const url = getenv("TOPGG_URL", false, true);
      await ctx.error(`:lock: To unlock the \`/${this.data.name}\` command, [vote for Remoji on top.gg](${url})!`);
      return;
    }

    // TODO: check this.options.premiumOnly

    await this.run(ctx);
  }

  abstract run(ctx: CommandContext<GUILD>): Promise<void>;
}
