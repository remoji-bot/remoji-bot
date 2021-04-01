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
import { Command, botPermissionCheck, userPermissionCheck, CommandResult } from "../lib/command";
import eris from "eris";
import { MessageArgumentReader } from "discord-command-parser";
import fetch from "node-fetch";
import logger from "../lib/logger";

export class UploadCommand extends Command {
  constructor() {
    super({
      name: "upload",
      aliases: [],
      checks: {
        "User must have 'Manage Emojis' permission.": userPermissionCheck(["manageEmojis"]),
        "Bot must have 'Manage Emojis' permission.": botPermissionCheck(["manageEmojis"]),
      },
    });
  }

  async run(message: eris.Message<eris.GuildTextableChannel>, args: MessageArgumentReader): Promise<CommandResult | void> {
    const name = args.getString(false, v => /^\w+$/.test(v));
    const url =
      args.getString(false, v =>
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(v),
      ) ?? message.attachments[0]?.proxy_url;

    if (!name) {
      return { success: false, reason: "Specify a name for the new emoji." };
    }

    if (!url) {
      return { success: false, reason: "Specify a valid URL or upload an image." };
    }

    let content = ":hourglass: Downloading...";
    const reply = await message.channel.createMessage(content);

    try {
      const fetched = await fetch(url, {
        size: 256 * 1024,
      });

      const data = await fetched.buffer();

      content = content.split(":hourglass:").join(":white_check_mark:") + " Done!\n:hourglass: Uploading...";
      await reply.edit(content);

      const created = await this.bot.client.createGuildEmoji(message.guildID as string, {
        name,
        image: `data:${fetched.headers.get("Content-Type") || "image/png"};base64,${data.toString("base64")}`,
      });

      content =
        content.split(":hourglass:").join(":white_check_mark:") + ` Done!\n:white_check_mark: Uploaded emoji! \`:${created.name}:\``;

      await reply.edit(content);
    } catch (err) {
      logger.error(err);
      content = content.split(":hourglass:").join(":x:") + " Failed!";
      await reply.edit(content);
      return { success: false, reason: "Could not create the emoji. Make sure you specified a valid image under 256KiB." };
    }
  }
}
