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
import got from "got";

import { getEmoteCDNLink, getRemainingGuildEmoteSlots, EmbedUtil, arraySumColumn } from "../lib/utils";
import { Bot } from "../lib/bot";
import logger from "../lib/logger";
import Constants from "../Constants";
import { stripIndents } from "common-tags";

export default class CopyCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "copy",
      description: "Copies one or more emotes to the current server",
      options: [
        {
          name: "emotes",
          description: "The emotes to copy (must be custom emotes)",
          type: CommandOptionType.STRING,
          required: true,
        },
        {
          name: "name",
          description: "The name for the new, copied emote (if uploading only one)",
          type: CommandOptionType.STRING,
          required: false,
        },
      ],
    });
    this.filePath = __filename;
  }

  readonly bucket = Bot.rates.bucket(1, 15, "command:copy");

  async run(ctx: CommandContext): Promise<void | string> {
    if (!(await this.bucket.take(ctx.user.id))) {
      await ctx.send({
        ephemeral: true,
        embeds: [EmbedUtil.error(":octagonal_sign: This command may only be used once every 15 seconds.")],
      });
      return;
    }
    if (!ctx.guildID) {
      await ctx.send({ embeds: [EmbedUtil.error(":x: This command may only be used in a server.")] });
      return;
    }

    if (!ctx.member?.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS)) {
      await ctx.send({ embeds: [EmbedUtil.error(":lock: You need the Manage Emojis permission to use this command.")], ephemeral: true });
      return;
    }

    const emotes = ctx.options.emotes as string;
    const name = ctx.options.name as string | null;

    const uploads = [] as { emote: string; url: string; name: string; animated: boolean }[];
    for (const [emote, animatedFlag, name, id] of emotes.matchAll(/<(a?):([\w_]{2,32}):([1-9]\d{17,20})>/g)) {
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
    } else if (uploads.length > 1) {
      if (name) {
        await ctx.send({
          ephemeral: true,
          embeds: [EmbedUtil.error(":x: If you are copying multiple emotes at once, you can't specify a `name` option.")],
        });
        return;
      }
      if (uploads.length > 30) {
        await ctx.send({
          ephemeral: true,
          embeds: [EmbedUtil.error(":x: Limit 30 emotes, please!")],
        });
        return;
      }
      const voted = await Bot.getInstance().topgg.hasVoted(ctx.user.id);
      if (!voted) {
        await ctx.send({
          embeds: [
            EmbedUtil.info(
              stripIndents`
                🛑 To enable uploading multiple emotes at once, go vote for Remoji on top.gg!
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

    await ctx.defer();

    const errors = [] as string[];

    for (const upload of uploads) {
      logger.info(`Copy: ${upload.emote} (${upload.url}) -> ${name ?? upload.name}`);
      try {
        const fetched = await got(upload.url);
        await Bot.getInstance().client.createGuildEmoji(ctx.guildID, {
          name: name ?? upload.name,
          image: `data:${fetched.headers["content-type"]};base64,${fetched.rawBody.toString("base64")}`,
        });
      } catch (err) {
        logger.error({ upload, err });
        errors.push(`${upload.emote} (\`:${name ?? upload.name}:\`): \`${err.message ?? "Unknown Error"}\``);
      }
      await new Promise(r => setTimeout(r, 500 * 1.1 ** errors.length));
    }

    if (errors.length === uploads.length) {
      await ctx.send({
        embeds: [
          EmbedUtil.error(
            stripIndents`
              :no_entry: Failed to copy emotes! This is likely due to an error with the specific emotes you chose or permissions.

              **__Troubleshooting__**
              **1.**  Make sure Remoji has the **Manage Emojis** permission in the server.
              **2.**  Try using the \`/upload\` command with the emoji URL (right-click emote -> Copy Link).
              **3.**  The emoji may be very close to the size limit (256kB), in which case it may be too large after encoding. Try resizing it.

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
        embeds: [EmbedUtil.success(`:white_check_mark: Success! Copied ${uploads.length} emote${uploads.length > 1 ? "s" : ""}!`)],
      });
      return;
    }
  }
}
