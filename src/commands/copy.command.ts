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

import { SlashCommand, SlashCreator, CommandContext, CommandOptionType } from "slash-create";
import got from "got";

import { getEmoteCDNLink, getRemainingGuildEmoteSlots } from "../lib/utils";
import { Bot } from "../lib/bot";
import logger from "../lib/logger";

class CopyCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "copy",
      description: "Copies an emote to the current server",
      options: [
        {
          name: "emote",
          description: "The emote to copy (must be a custom emote)",
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

    const emote = ctx.options.emote as string;
    const name = ctx.options.name as string;

    // [0] = full string, [1] = (animated ? 'a' : ''), [2] = ID
    const [, animatedFlag, id] = emote.match(/^<(a?):\w+:([0-9]+)>$/) ?? [];

    if (!/^<(a?):\w+:[0-9]+>$/.test(emote) || !id) {
      await ctx.send(
        ":x: That doesn't look like a valid custom emote. To copy an existing emote, just select it from the emoji picker when prompted for the `emote` in the command. If you're trying to copy an emote for which you do not have access, try the `/upload` command instead.",
        { ephemeral: true },
      );
      return;
    }

    const animated = !!animatedFlag;

    if (!/^[\w_]+$/.test(name)) {
      await ctx.send(":x: That isn't a valid custom emote name. Use numbers, letters, and/or underscore (`_`) characters in your name.", {
        ephemeral: true,
      });
      return;
    }

    const url = getEmoteCDNLink(id, animated);

    await ctx.defer();

    const [remStandard, remAnimated] = await getRemainingGuildEmoteSlots(Bot.getInstance().client, ctx.guildID);

    if (animated && !remAnimated) {
      await ctx.send(":no_entry: You do not have any available animated emote slots left in this server.");
      return;
    } else if (!animated && !remStandard) {
      await ctx.send(":no_entry: You do not have any available normal emote slots left in this server.");
      return;
    }

    // Download
    const fetched = await got(url, { throwHttpErrors: false });
    if (fetched.statusCode !== 200) {
      logger.warn(`emote download failed: ${fetched.statusCode} (${fetched.statusMessage})`);
      await ctx.send(":x: Could not download the emote. Make sure you typed it correctly!");
      return;
    }

    // Upload
    try {
      const created = await Bot.getInstance().client.createGuildEmoji(ctx.guildID, {
        name,
        image: `data:${fetched.headers["content-type"]};base64,${fetched.rawBody.toString("base64")}`,
      });
      await ctx.send(`:white_check_mark: Copied emote! \`:${created.name}:\``);
    } catch (error) {
      logger.error(error);
      await ctx.send(
        ":no_entry: Failed to copy emote! This may be because you are out of emote slots or it may be due to an error with the specific emote you chose.",
      );
    }
  }
}

export = CopyCommand;
