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
import { getenv } from "./functions";

/**
 *An embed builder.
 */
export class EmbedUtil {
  /**
   * Create a base embed.
   *
   * @returns - The created base embed.
   */
  public static base(): MessageEmbed {
    return new MessageEmbed()
      .setColor(0xfffffe)
      .setAuthor("Remoji - Discord Emoji Manager", getenv("TOPGG_URL", false, true));
  }

  /**
   * Create an error embed.
   *
   * @param description - The description of the error embed.
   * @returns - The created error embed.
   */
  public static error(description: string): MessageEmbed {
    return this.base()
      .setColor(0xff5555)
      .setDescription(description)
      .addField("Need help?", `[Join the support server](${getenv("SUPPORT_INVITE")})`);
  }

  /**
   * Create a success embed.
   *
   * @param description - The description of the success embed.
   * @returns - The created success embed.
   */
  public static success(description: string): MessageEmbed {
    return this.base()
      .setColor(0x55ff55)
      .setAuthor(
        "Click here to vote for Remoji!",
        "https://i.imgur.com/1wLOFn2.png", // Star
        getenv("TOPGG_URL", false, true),
      )
      .setDescription(description)
      .setFooter("Remoji - Discord Emoji Manager - Created by Shino");
  }

  /**
   * Creates a success-followup embed.
   *
   * @param description - The description of the success-followup embed.
   * @returns - The created success-followup embed.
   */
  public static successFollowup(description: string): MessageEmbed {
    return new MessageEmbed().setColor(0x55ff55).setDescription(description);
  }

  /**
   * Create an info embed.
   *
   * @param description - The description of the info embed.
   * @returns - The created info embed.
   */
  public static info(description: string): MessageEmbed {
    return this.base().setColor(0x5555ff).setDescription(description);
  }

  private constructor() {
    // private
  }
}
