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

import { MessageEmbed } from "discord.js";
import { I18N } from "../../i18n";
import { Bot } from "../bot";
import environment from "../../environment";

/**
 *An embed builder.
 */
export class EmbedUtil {
  /**
   * Create a base embed.
   *
   * @param i18n - The `I18N` instance to use
   * @returns - The created base embed.
   */
  public static base(i18n: I18N): MessageEmbed {
    return new MessageEmbed()
      .setColor(0xfffffe)
      .setAuthor(
        i18n.embed_remoji_author_name,
        Bot.getInstance().client.user?.displayAvatarURL(),
        environment.TOPGG_VOTE_URL,
      );
  }

  /**
   * Create an error embed.
   *
   * @param i18n - The `I18N` instance to use
   * @param description - The description of the error embed.
   * @returns - The created error embed.
   */
  public static error(i18n: I18N, description: string): MessageEmbed {
    return this.base(i18n)
      .setColor(0xff5555)
      .setDescription(description)
      .addField(
        i18n.embed_help_callout_title,
        `[${i18n.embed_join_support_server_link}](${environment.SUPPORT_INVITE})`,
      );
  }

  /**
   * Create a success embed.
   *
   * @param i18n - The `I18N` instance to use
   * @param description - The description of the success embed.
   * @returns - The created success embed.
   */
  public static success(i18n: I18N, description: string): MessageEmbed {
    return this.base(i18n)
      .setColor(0x55ff55)
      .setAuthor(
        i18n.embed_vote_callout_link,
        "https://i.imgur.com/1wLOFn2.png", // Star
        environment.TOPGG_VOTE_URL,
      )
      .setDescription(description)
      .setFooter(i18n.embed_footer_tagline);
  }

  /**
   * Creates a success-followup embed.
   *
   * @param i18n - The `I18N` instance to use
   * @param description - The description of the success-followup embed.
   * @returns - The created success-followup embed.
   */
  public static successFollowup(i18n: I18N, description: string): MessageEmbed {
    return new MessageEmbed().setColor(0x55ff55).setDescription(description);
  }

  /**
   * Create an info embed.
   *
   * @param i18n - The `I18N` instance to use
   * @param description - The description of the info embed.
   * @returns - The created info embed.
   */
  public static info(i18n: I18N, description: string): MessageEmbed {
    return this.base(i18n).setColor(0x5555ff).setDescription(description);
  }

  private constructor() {
    // private
  }
}
