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

import { Command } from "../../core/base/command";
import { CommandContext } from "../../core/base/commandcontext";
import { EmbedUtil } from "../../core/utils/embedutil";
import { time } from "../../core/utils/functions";

/**
 * `/ping` command - Tests the bot's connection to Discord.
 */
export class PingCommand extends Command {
  constructor() {
    super({
      name: "pingg",
      description: "Test the bot's connection to Discord",
    });
  }

  /**
   * Run the command.
   *
   * @param ctx - The context for the command.
   */
  async run(ctx: CommandContext): Promise<void> {
    const [delay] = await time(() => ctx.interaction.defer());
    await ctx.interaction.editReply({
      embeds: [EmbedUtil.success(`Pong! Latency: ${delay}ms`)],
    });
  }
}
