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
import { Logger } from "../../core/logger";
import { getenv } from "../../core/utils/functions";
import { ImageUtil } from "../../core/utils/imageutil";

/**
 * `/copy` command - Copy one or more emotes to your server.
 */
export class CopyCommand extends Command<true> {
  constructor() {
    super(
      {
        name: "copy",
        description: "Copy one or more emotes to your server",
        options: [
          {
            name: "single",
            type: "SUB_COMMAND",
            description: "Copy a single emote",
            options: [
              {
                name: "emote",
                type: "STRING",
                description: "The emote to copy",
                required: true,
              },
              {
                name: "name",
                type: "STRING",
                description: "The new name for the emote",
                required: false,
              },
            ],
          },
          {
            name: "multiple",
            type: "SUB_COMMAND",
            description: "Copy multiple emotes at once",
            options: [
              {
                name: "emotes",
                type: "STRING",
                description: "The emotes to copy (up to 30!)",
                required: true,
              },
            ],
          },
        ],
      },
      {
        guildOnly: true,
      },
    );
  }

  /**
   * Run the command.
   *
   * @param ctx - The context for the command.
   */
  async run(ctx: CommandContext<true>): Promise<void> {
    const single = ctx.options.subcommand("single");
    const multiple = ctx.options.subcommand("multiple");

    // TODO: check remaining emote slots/animated status

    if (single) {
      // Upload single emote
      const emote = ImageUtil.extractEmojis(single.string("emote"))[0];
      const name = single.string("name", false);

      if (!emote) {
        await ctx.error(ctx.s.emote_copy_invalid_emote);
        return;
      }

      if (name && !/^[a-z0-9_]{2,32}$/i.test(name)) {
        await ctx.error(ctx.s.emote_copy_invalid_name);
        return;
      }

      const image = await ImageUtil.downloadImage(emote.url);

      if (!image.success) {
        if (image.error) await ctx.error(ctx.s.image_download_error_with_reason(image.error));
        else if (!image.validURL) await ctx.error(ctx.s.emote_copy_invalid_url);
        else if (!image.whitelistedURL) await ctx.error(ctx.s.emote_copy_invalid_domain);
        else await ctx.error(ctx.s.emote_copy_unknown_download_error);
        return;
      }

      try {
        const newEmoji = await ctx.interaction.guild.emojis.create(Buffer.from(image.data), name ?? emote.name);
        await ctx.success(ctx.s.emote_copy_success(name ?? emote.name, newEmoji.toString()));
      } catch (error) {
        Logger.error(error);
        await ctx.error(ctx.s.emote_copy_unknown_upload_error);
      }
    } else if (multiple) {
      if (!(await this.bot.topgg.hasVoted(ctx.interaction.user.id))) {
        await ctx.error(ctx.s.command_error_vote_locked("copy multiple", getenv("TOPGG_URL", false, true)));
        return;
      }

      // TODO
      await ctx.error("TODO");

      // TODO: Copying progress
      // TODO: Graceful error handling
      // TODO: Handle Discord upload ratelimit
    }
  }
}
