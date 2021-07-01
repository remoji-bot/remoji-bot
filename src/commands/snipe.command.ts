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

import { getRemainingGuildEmoteSlots, EmbedUtil, getEmoteCDNLink, arraySumColumn } from "../lib/utils";
import { Bot } from "../lib/bot";
import logger from "../lib/logger";
import { stripIndents } from "common-tags";
import Constants from "../Constants";
import got from "got";

export default class SnipeCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "snipe",
      description: "Snipe emojis from a message link",
      options: [
        {
          name: "url",
          description: "The message URL to snipe emojis from",
          type: CommandOptionType.STRING,
          required: true,
        },
      ],
      guildIDs: ["683009037830324235"],
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

    const regex = /^https:\/\/(canary\.|ptb\.)?discord\.com\/channels\/\d{17,20}\/(?<channel>\d{17,20})\/(?<message>\d{17,20})$/;
    const groups = url.match(regex)?.groups;

    if (!groups) {
      await ctx.send({
        ephemeral: true,
        embeds: [EmbedUtil.error(":x: That doesn't look like a valid message URL.")],
      });
      return;
    }

    const bot = Bot.getInstance().client;

    const message = await bot.getMessage(groups.channel, groups.message);

    await ctx.defer();

    const uploads = [] as { emote: string; url: string; name: string; animated: boolean }[];
    for (const [emote, animatedFlag, name, id] of message.content.matchAll(/<(a?):([\w_]{2,32}):([1-9]\d{17,20})>/g)) {
      const url = getEmoteCDNLink(id, !!animatedFlag);
      if (!uploads.some(e => e.url === url))
        uploads.push({
          emote,
          url,
          name,
          animated: !!animatedFlag,
        });
    }

    if (uploads.length === 0) {
      await ctx.send({
        ephemeral: true,
        embeds: [EmbedUtil.error(":x: Please specify one or more valid **custom** emotes.")],
      });
      return;
    } else {
      if (uploads.length > 30) {
        await ctx.send({
          ephemeral: true,
          embeds: [EmbedUtil.error(":x: Limit 30 emotes, please!")],
        });
        return;
      }
      const voted = !process.env.TOPGG_TOKEN || (await Bot.getInstance().topgg.hasVoted(ctx.user.id));
      if (!voted) {
        await ctx.send({
          embeds: [
            EmbedUtil.info(
              stripIndents`
                🛑 To enable message emote sniping, go vote for Remoji on top.gg!
                **[CLICK HERE TO VOTE](${Constants.topGG}/vote)**
              `,
            ).setColor(0xffff00),
          ],
        });
        return;
      }
    }

    const [remStandard, remAnimated] = await getRemainingGuildEmoteSlots(Bot.getInstance().client, ctx.guildID);
    const [remStandardNew, remAnimatedNew] = [
      remStandard - arraySumColumn(uploads, "animated", x => (x ? 0 : 1)),
      remAnimated - arraySumColumn(uploads, "animated", x => (x ? 1 : 0)),
    ];

    logger.debug({ remStandard, remAnimated, remStandardNew, remAnimatedNew });
    if (remStandardNew < 0) {
      await ctx.send({
        ephemeral: true,
        embeds: [
          EmbedUtil.error(
            `:x: There are not enough **regular** emote slots available in the server; **you need ${-remStandardNew} more regular emote slots** to process this upload.`,
          ),
        ],
      });
      return;
    }
    if (remAnimatedNew < 0) {
      await ctx.send({
        ephemeral: true,
        embeds: [
          EmbedUtil.error(
            `:x: There are not enough **animated** emote slots available in the server; **you need ${-remAnimatedNew} more animated emote slots** to process this upload.`,
          ),
        ],
      });
      return;
    }

    await ctx.send(`Uploading ${uploads.length} emotes...`);

    const errors = [] as string[];

    const start = Date.now();
    for (const [i, upload] of uploads.entries()) {
      logger.info(`Snipe: ${upload.emote} (${upload.url}) -> ${upload.name}`);
      try {
        const fetched = await got(upload.url);
        await Bot.getInstance().client.createGuildEmoji(ctx.guildID, {
          name: upload.name,
          image: `data:${fetched.headers["content-type"]};base64,${fetched.rawBody.toString("base64")}`,
        });
      } catch (err) {
        logger.error({ upload, err });
        errors.push(`${upload.emote} (\`:${upload.name}:\`): \`${err.message ?? "Unknown Error"}\``);
      }
      logger.debug(`[snipe] setTimeout: 500 * ${errors.length} = ${500 * errors.length}`);
      if (i >= uploads.length - 1) {
        await ctx.editOriginal(
          `Uploaded ${uploads.length - errors.length} / ${uploads.length} emotes (${errors.length} failed) in ${(
            (Date.now() - start) /
            1000
          ).toFixed(1)} sec.`,
        );
      } else {
        await ctx.editOriginal(`Uploading emote ${i + 1} / ${uploads.length}${errors.length ? ` (${errors.length} failed)` : ""}...`);
      }
      await new Promise(r => setTimeout(r, 500 * errors.length));
    }

    if (errors.length === uploads.length) {
      await ctx.send({
        embeds: [
          EmbedUtil.error(
            stripIndents`
              :no_entry: Failed to snipe emotes! This is likely due to an error with the specific emotes you chose or permissions.

              **__Troubleshooting__**
              **1.**  Make sure Remoji has the **Manage Emojis** permission in the server.
              **2.**  Try using the \`/upload\` command with the emoji URL (right-click emote -> Copy Link).
              **3.**  An emoji may be very close to the size limit (256kB), in which case it may be too large after encoding. Try resizing it.

              If the problem persists or you need help, **please** join the support server! ${Constants.supportServerInvite}
            `,
          ).addField("Details", errors.join("\n")),
        ],
      });
      return;
    } else if (errors.length > 0) {
      await ctx.send({
        embeds: [
          EmbedUtil.success(
            stripIndents`
              :warning: Not all emotes were copied! See "**Errors**" below for details.
              Uploaded ${uploads.length - errors.length}/${uploads.length}).

              **__Troubleshooting__**
              **1.**  Try using the \`/upload\` command with the emote URL (right-click emote -> Copy Link).
              **2.**  The emote may be very close to the size limit (256kB), in which case it may be too large after encoding. Try resizing it.

              If the problem persists or you need help, **please** join the support server! ${Constants.supportServerInvite}
            `,
          ).addField("Details", errors.join("\n")),
        ],
      });
      return;
    } else {
      await ctx.send({
        embeds: [EmbedUtil.success(`:white_check_mark: Success! Sniped ${uploads.length} emote${uploads.length > 1 ? "s" : ""}!`)],
      });
      return;
    }
  }
}
