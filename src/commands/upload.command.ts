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

import { getRemainingGuildEmoteSlots, EmbedUtil } from "../lib/utils";
import { Bot } from "../lib/bot";
import logger from "../lib/logger";
import { stripIndents } from "common-tags";
import Constants from "../Constants";

export default class UploadCommand extends SlashCommand {
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
      await ctx.send({ embeds: [EmbedUtil.error(":x: This command may only be used in a server.")] });
      return;
    }

    if (!ctx.member?.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS)) {
      await ctx.send({ ephemeral: true, embeds: [EmbedUtil.error(":lock: You need the Manage Emojis permission to use this command.")] });
      return;
    }

    const url = ctx.options.url as string;
    const name = ctx.options.name as string;

    if (!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(url)) {
      await ctx.send({
        ephemeral: true,
        embeds: [
          EmbedUtil.error(
            ":x: That doesn't look like a valid URL. Make sure you specify a direct URL, like `https://i.imgur.com/nHcnkvY.png`",
          ),
        ],
      });
      return;
    }

    if (!/^[\w_]+$/.test(name) || name.length < 2) {
      await ctx.send({
        ephemeral: true,
        embeds: [
          EmbedUtil.error(
            ":x: That isn't a valid custom emote name. Use numbers, letters, and/or underscore (`_`) characters in your name. Names must be at least 2 characters long.",
          ),
        ],
      });
      return;
    }

    let urlUrl: URL;
    try {
      urlUrl = new URL(url);
    } catch (err) {
      logger.error(err);
      await ctx.send({ ephemeral: true, embeds: [EmbedUtil.error(":x: Failed to parse URL.")] });
      return;
    }

    if (urlUrl.protocol !== "http:" && urlUrl.protocol !== "https:") {
      await ctx.send({ ephemeral: true, embeds: [EmbedUtil.error(":x: Only `http:` and `https:` URLs are allowed.")] });
      return;
    }

    if (!Constants.imageDomainWhitelist.some(domain => domain.toLowerCase() === urlUrl.hostname.toLowerCase())) {
      let siteList = "";
      for (const domain of Constants.imageDomainWhitelist) siteList += `-  \`${domain}\`\n`;
      await ctx.send({
        ephemeral: true,
        embeds: [
          EmbedUtil.error(
            stripIndents`
              :x: For security reasons, only images hosted on the following sites may be used:
              ${siteList}
              If you need to use an image from another site, just upload it to Discord first and copy the Discord image link.
            `,
          ),
        ],
      });
      return;
    }

    const [remStandard, remAnimated] = await getRemainingGuildEmoteSlots(Bot.getInstance().client, ctx.guildID);

    if (urlUrl.pathname.endsWith(".gif") && remAnimated < 1) {
      await ctx.send({ ephemeral: true, embeds: [EmbedUtil.error(":no_entry: There are no animated emote slots left in this server.")] });
      return;
    } else if (!urlUrl.pathname.endsWith(".gif") && remStandard < 1) {
      await ctx.send({ ephemeral: true, embeds: [EmbedUtil.error(":no_entry: There are no normal emote slots left in this server.")] });
      return;
    }

    await ctx.defer();

    try {
      const fetched = await fetch(url, {
        size: 256 * 1000,
        timeout: 10000,
      });

      if (fetched.status !== 200) throw new Error(`Request to ${url} failed with status ${fetched.status}`);

      const data = await fetched.buffer();

      const created = await Bot.getInstance().client.createGuildEmoji(ctx.guildID, {
        name,
        image: `data:${fetched.headers.get("Content-Type") ?? "image/png"};base64,${data.toString("base64")}`,
      });

      await ctx.send({ embeds: [EmbedUtil.success(`:white_check_mark: Uploaded emote! \`:${created.name}:\``)] });
    } catch (error) {
      logger.error(error);
      await ctx.send({
        embeds: [
          EmbedUtil.error(stripIndents`
            :no_entry: Failed to create the emote! This is likely due to an error with the specific emote you chose or permissions.

            1.  Make sure that you specified a valid image (JPG, PNG, GIF) **under 256KB** or else Discord will reject it.
            2.  Make sure Remoji has the **Manage Emojis** permission in the server.
            3.  The image may be very close to the size limit (256kB), in which case it may be too large after encoding. Try resizing it.

            If the problem persists and you are sure that you are using a valid image, **please** join the support server and report it! ${Constants.supportServerInvite}
          `),
        ],
      });
    }
  }
}
