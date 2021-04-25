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

import { SlashCommand, SlashCreator, CommandContext, CommandOptionType, Permissions } from "slash-create";
import fetch from "node-fetch";
import { URL } from "url";

import { getRemainingGuildEmoteSlots } from "../lib/utils";
import { Bot } from "../lib/bot";
import logger from "../lib/logger";
import { stripIndents } from "common-tags";
import Constants from "../Constants";

class UploadCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "upload",
      description: "Uploads an emote to the current server",
      options: [
        {
          name: "url",
          description: "The image URL to upload (must be a valid image and smaller than 256kB)",
          type: CommandOptionType.STRING,
          required: true,
        },
        {
          name: "name",
          description: "The name for the new, copied emote",
          type: CommandOptionType.STRING,
          required: true,
        },
      ],
    });
    this.filePath = __filename;
  }

  async run(ctx: CommandContext): Promise<void | string> {
    if (!ctx.guildID) {
      await ctx.send(":x: This command may only be used in a server.");
      return;
    }

    if (!ctx.member?.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS)) {
      await ctx.send(":lock: You need the Manage Emojis permission to use this command.", { ephemeral: true });
      return;
    }

    const url = ctx.options.url as string;
    const name = ctx.options.name as string;

    if (!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(url)) {
      await ctx.send(":x: That doesn't look like a valid URL. Make sure you specify a direct URL, like `https://i.imgur.com/nHcnkvY.png`", {
        ephemeral: true,
      });
      return;
    }

    if (!/^[\w_]+$/.test(name)) {
      await ctx.send(":x: That isn't a valid custom emote name. Use numbers, letters, and/or underscore (`_`) characters in your name.", {
        ephemeral: true,
      });
      return;
    }

    await ctx.defer();

    const [remStandard, remAnimated] = await getRemainingGuildEmoteSlots(Bot.getInstance().client, ctx.guildID);

    const urlUrl = new URL(url);

    if (urlUrl.pathname.endsWith(".gif") && !remAnimated) {
      await ctx.send(":no_entry: There are no animated emote slots left in this server.");
      return;
    } else if (!urlUrl.pathname.endsWith(".gif") && !remStandard) {
      await ctx.send(":no_entry: There are no normal emote slots left in this server.");
      return;
    }

    try {
      const fetched = await fetch(url, {
        size: 256 * 1000,
        timeout: 10000,
      });

      const data = await fetched.buffer();

      const created = await Bot.getInstance().client.createGuildEmoji(ctx.guildID, {
        name,
        image: `data:${fetched.headers.get("Content-Type")};base64,${data.toString("base64")}`,
      });

      await ctx.send(`:white_check_mark: Uploaded emote! \`:${created.name}:\``);
    } catch (error) {
      logger.error(error);
      await ctx.send(stripIndents`
        :no_entry: Failed to create the emote! This is likely due to an error with the specific emote you chose or permissions.

        1.  Make sure that you specified a valid image (JPG, PNG, GIF) **under 256KB** or else Discord will reject it.
        2.  Make sure Remoji has the **Manage Emojis** permission in the server.

        If the problem persists and you are sure that you are using a valid image, **please** join the support server and report it! ${Constants.supportServerInvite}
      `);
    }
  }
}

export = UploadCommand;
