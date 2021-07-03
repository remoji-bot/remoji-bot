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
import { ImageUtil } from "../../core/utils/imageutil";

/**
 * `/upload` command - Upload an emote by its link.
 */
export class UploadCommand extends Command<true> {
  constructor() {
    super(
      {
        name: "upload",
        description: "Upload an emote by its link",
        options: [
          {
            name: "url",
            type: "STRING",
            description: "The link to the emote or image",
            required: true,
          },
          {
            name: "name",
            type: "STRING",
            description: "The name of the new emote to create",
            required: true,
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
   * @returns - void
   */
  async run(ctx: CommandContext<true>): Promise<void> {
    const url = ctx.options.string("url");
    const name = ctx.options.string("name");

    if (name.length < 3 || !/^[\w_]+$/.test(name)) return await ctx.error(ctx.s.image_invalid_name);

    const image = await ImageUtil.downloadImage(url);

    if (!image.success) {
      if (image.error) await ctx.error(ctx.s.image_download_error_with_reason(image.error));
      else if (!image.validURL) await ctx.error(ctx.s.image_invalid_url);
      else if (!image.whitelistedURL) await ctx.error(ctx.s.image_invalid_domain);
      else await ctx.error(ctx.s.image_unknown_error);
      return;
    }

    // TODO: check remaining emote slots/animated status

    try {
      const emoji = await ctx.interaction.guild.emojis.create(Buffer.from(image.data), name, {
        reason: `Uploaded by ${ctx.interaction.user.tag} (${ctx.interaction.user.id}) using /${this.data.name}`,
      });
      await ctx.success(ctx.s.image_upload_success(name, emoji.toString()));
    } catch (error) {
      Logger.error(error);
      await ctx.error(ctx.s.image_upload_failed_unknown_error);
    }
  }
}
