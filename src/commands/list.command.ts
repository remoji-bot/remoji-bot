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
import { Command, botPermissionCheck } from "../lib/command";
import eris from "eris";

export class ListCommand extends Command {
  constructor() {
    super({
      name: "list",
      aliases: [],
      checks: {
        "Bot must have 'Embed Links' permission.": botPermissionCheck(["embedLinks"]),
      },
    });
  }

  async run(message: eris.Message<eris.GuildTextableChannel>): Promise<void> {
    const descs: string[] = [];
    let s = "";

    for (const emoji of message.channel.guild.emojis.sort((a, b) => a.name.localeCompare(b.name))) {
      const line = ` <${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`;
      if (s.length + line.length > 2048) {
        descs.push(s);
        s = line.trim();
      } else {
        s += line;
      }
    }
    if (s) descs.push(s);
    if (descs.length > 0) {
      for (const desc of descs)
        await this.bot.client.createMessage(message.channel.id, {
          embed: {
            color: 0xf5f5f5,
            description: desc,
          },
        });
    } else {
      await this.bot.client.createMessage(message.channel.id, {
        embed: {
          color: 0xf5f5f5,
          description: "No emotes exist in this server... *yet*",
        },
      });
    }
  }
}
