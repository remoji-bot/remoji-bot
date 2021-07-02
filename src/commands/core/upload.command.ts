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

/**
 * `/upload` command - Tests the bot's connection to Discord.
 */
export class UploadCommand extends Command {
  private static readonly DOMAIN_WHTIELIST: readonly string[] = [
    "i.imgur.com",
    "cdn.discordapp.com",
    "media.discordapp.net",
  ];
  private static readonly URL_REGEX =
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

  constructor() {
    super({
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
    });
  }

  /**
   * Run the command.
   *
   * @param ctx - The context for the command.
   * @returns - void
   */
  async run(ctx: CommandContext): Promise<void> {
    const url = ctx.options.string("url");
    const name = ctx.options.string("name");
    if (!UploadCommand.URL_REGEX.test(url)) return await ctx.error("That doesn't look like a valid URL...");
    if (name.length < 3 || !/^[\w_]+$/.test(name)) return await ctx.error("That doesn't look like a valid name...");
    // TODO
  }
}
