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

import { SlashCommand, SlashCreator, CommandContext } from "slash-create";

import { time, EmbedUtil } from "../lib/utils";

export default class PingCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "ping",
      description: "Tests the bot's connection to Discord",
    });
    this.filePath = __filename;
  }

  async run(ctx: CommandContext): Promise<void> {
    const [delay] = await time(() => ctx.defer());
    await ctx.send({
      embeds: [EmbedUtil.success(`Pong! Latency: ${delay}ms`)],
    });
  }
}
