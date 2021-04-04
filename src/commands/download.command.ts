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
import { stripIndents } from "common-tags";

import { getEmoteCDNLink } from "../lib/utils";
import logger from "../lib/logger";

class DownloadCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "download",
      description: "Downloads an emote (for permalinking) and shows info about it",
      options: [
        {
          name: "emote",
          description: "The emote to download (must be a custom emote)",
          type: CommandOptionType.STRING,
          required: true,
        },
      ],
    });
    this.filePath = __filename;
  }

  async run(ctx: CommandContext): Promise<void | string> {
    const emote = ctx.options.emote as string;

    const [, animatedFlag, name, id] = emote.match(/^<(a?):(\w+):([0-9]+)>$/) ?? [];

    if (!/^<(a?):\w+:[0-9]+>$/.test(emote) || !id) {
      await ctx.send(
        ":x: That doesn't look like a valid custom emote. To download an existing emote, just select it from the emoji picker when prompted for the `emote` in the command.",
        { ephemeral: true },
      );
      return;
    }

    const animated = !!animatedFlag;

    const url = getEmoteCDNLink(id, animated);

    await ctx.defer();

    // Download
    const fetched = await got(url, { throwHttpErrors: false });
    if (fetched.statusCode !== 200) {
      logger.warn(`emote download failed: ${fetched.statusCode} (${fetched.statusMessage})`);
      await ctx.send(":x: Could not download the emote. Make sure you typed it correctly!");
      return;
    }

    await ctx.send({
      content: stripIndents`
          **Name**: \`${name}\`
          **Animated**: ${animated ? "Yes" : "No"}
          **ID**: \`${id}\`
          **URL**: <${url}>
          **Image (attached):**`,
      file: {
        file: fetched.rawBody,
        name: `${name}.${animated ? "gif" : "png"}`,
      },
    });
  }
}

export = DownloadCommand;
