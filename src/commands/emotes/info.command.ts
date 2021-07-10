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
import { EmbedUtil } from "../../core/utils/embedutil";
import { Bot } from "../../core/bot";

/**
 * `/info` command - Get info about Remoji.
 */
export class InfoCommand extends Command<true> {
  constructor() {
    super(
      {
        name: "info",
        description: "Get info about Remoji",
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
    const bot = Bot.getInstance();

    const infoEmbed = EmbedUtil.info(ctx.s, ctx.s.info_remoji_description)
      .setThumbnail(bot.client.user?.avatarURL() ?? "") // TODO: Fix this mess
      .addField(ctx.s.info_remoji_server_field, ctx.s.info_remoji_server_invite(bot.constants.supportServerInvite))
      .addField(
        ctx.s.info_remoji_bot_field,
        ctx.s.info_remoji_bot_invite(bot.client.user?.id ?? "", bot.constants.requiredPermissions),
      ) // TODO: Fis this mess too
      .addField(ctx.s.info_remoji_vote_field, ctx.s.info_remoji_vote_value(bot.constants.topGG))
      .addField(ctx.s.info_remoji_created, ctx.s.info_remoji_created_value)
      .setFooter(ctx.s.info_remoji_version(bot.constants.version, bot.constants.git.branch, bot.constants.git.commit));
    await ctx.interaction.reply({ embeds: [infoEmbed] });
  }
}
