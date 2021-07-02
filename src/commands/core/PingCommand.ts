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

import { CommandInteraction } from "discord.js";
import { Command } from "../../core/base/command";
import { EmbedUtil } from "../../core/utils/embeds";
import { time } from "../../core/utils/functions";

/**
 * `/ping` command - Tests the bot's connection to Discord.
 */
export class PingCommand extends Command {
  constructor() {
    super({
      name: "ping",
      description: "Test the bot's connection to Discord",
    });
  }

  /**
   * Run the command.
   *
   * @param interaction - The interaction object for the command.
   */
  async run(interaction: CommandInteraction): Promise<void | string> {
    const [delay] = await time(interaction.defer);
    await interaction.reply({
      embeds: [EmbedUtil.success(`Pong! Latency: ${delay}ms`)],
    });
  }
}
