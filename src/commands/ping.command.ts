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
import { Command } from "../lib/command";
import eris from "eris";
import { stripIndents } from "common-tags";
import { time } from "../lib/utils";

export class PingCommand extends Command {
  constructor() {
    super({
      name: "ping",
      aliases: [],
      checks: {},
    });
  }

  async run(message: eris.Message): Promise<void> {
    const [elapsed, reply] = await time(() => this.bot.client.createMessage(message.channel.id, "Pong!"));
    await reply.edit(stripIndents`
        Pong!
        Message Edit: ${elapsed}ms
        Websocket: ${Math.floor(this.bot.client.shards.reduce((a, s) => a + s.latency, 0) / this.bot.client.shards.size)}ms`);
  }
}
