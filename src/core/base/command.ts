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
import { CommandContext } from "./commandcontext";

export interface CommandOptions {
  voterOnly?: boolean;
  premium?: boolean;
}

/**
 * The basic abstract class for all commands.
 */
export abstract class Command {
  readonly data: Readonly<discord.ApplicationCommandData>;
  readonly bot = Bot.getInstance();

  private readonly options: Readonly<CommandOptions>;

  constructor(data: discord.ApplicationCommandData, options: CommandOptions = {}) {
    Logger.verbose(`Constructed Command: ${data.name}`);
    this.data = data;
    this.options = options;
    assert(this._run === Command.prototype._run, "Command#_run must not be overridden");
  }

  /**
   * Internal method for running a command. Marked private to disallow override.
   * Called via index accessor in interaction event.
   *
   * @param ctx - The context to execute
   * @returns void
   */
  private async _run(ctx: CommandContext): Promise<void> {
    if (this.options.voterOnly && !(await this.bot.topgg.hasVoted(ctx.interaction.user.id))) {
      const url = getenv("TOPGG_URL", false, true);
      await ctx.error(`:lock: To unlock the \`/${this.data.name}\` command, [vote for Remoji on top.gg](${url})!`);
      return;
    }

    // TODO: premium

    await this.run(ctx);
  }

  abstract run(ctx: CommandContext): Promise<void>;
}
