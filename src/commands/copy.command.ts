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
import got from "got";

export class CopyCommand extends Command {
  constructor() {
    super({
      name: "copy",
      aliases: [],
      checks: {
        "User must have 'Manage Emojis' permission.": userPermissionCheck(["manageEmojis"]),
        "Bot must have 'Manage Emojis' permission.": botPermissionCheck(["manageEmojis"]),
      },
    });
  }

  async run(message: eris.Message<eris.GuildTextableChannel>, args: MessageArgumentReader): Promise<CommandResult | void> {
    const emoji = args.getString(false, v => /^<(a?):\w+:[0-9]+>$/.test(v));
    const name = args.getString(false, v => /^\w+$/.test(v));

    if (!emoji) {
      return { success: false, reason: "Specify a valid (custom) emoji." };
    }

    if (!name) {
      return { success: false, reason: "Specify a name for the new emoji." };
    }

    // [0] = full string, [1] = (animated ? 'a' : ''), [2] = ID
    const emojiMatch = emoji.match(/^<(a?):\w+:([0-9]+)>$/);

    if (!emojiMatch?.[2]) {
      return { success: false, reason: "Could not find the specified emoji." };
    }

    const emoteURL = `https://cdn.discordapp.com/emojis/${emojiMatch[2]}.${emojiMatch[1] ? "gif" : "png"}`;

    let content = ":hourglass: Downloading...";
    const reply = await message.channel.createMessage(content);

    const fetched = await got(emoteURL, {
      throwHttpErrors: false,
    });

    if (fetched.statusCode !== 200) {
      return { success: false, reason: "An error occurred while trying to download that emote." };
    }

    content = content.split(":hourglass:").join(":white_check_mark:") + " Done!\n:hourglass: Uploading...";
    await reply.edit(content);

    try {
      const created = await this.bot.client.createGuildEmoji(message.guildID as string, {
        name,
        image: `data:${fetched.headers["content-type"]};base64,${fetched.rawBody.toString("base64")}`,
      });

      content = content.split(":hourglass:").join(":white_check_mark:") + ` Done!\n:white_check_mark: Copied emoji! \`:${created.name}:\``;
      await reply.edit(content);
    } catch (error) {
      if (error instanceof eris.DiscordRESTError && error.code === 30008) {
        content = content.split(":hourglass:").join(":x:") + " Failed!";
        await Promise.all([
          reply.edit(content),
          message.channel.createMessage(":no_entry: Your server has reached the maximum number of emojis allowed by Discord!"),
        ]);
      } else {
        throw error;
      }
    }
  }
}