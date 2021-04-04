import { SlashCommand, SlashCreator, CommandContext, CommandOptionType } from "slash-create";
import fetch from "node-fetch";

import { getRemainingGuildEmoteSlots } from "../lib/utils";
import { Bot } from "../lib/bot";
import logger from "../lib/logger";

class UploadCommand extends SlashCommand {
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
      await ctx.send(":x: This command may only be used in a server.");
      return;
    }

    const url = ctx.options.url as string;
    const name = ctx.options.name as string;

    if (!/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/.test(url)) {
      await ctx.send(":x: That doesn't look like a valid URL. Make sure you specify a direct URL, like `https://i.imgur.com/nHcnkvY.png`", {
        ephemeral: true,
      });
      return;
    }

    if (!/^[\w_]+$/.test(name)) {
      await ctx.send(":x: That isn't a valid custom emote name. Use numbers, letters, and/or underscore (`_`) characters in your name.", {
        ephemeral: true,
      });
      return;
    }

    await ctx.defer();

    const [remStandard, remAnimated] = await getRemainingGuildEmoteSlots(Bot.getInstance().client, ctx.guildID);

    if (url.endsWith("gif") && !remAnimated) {
      await ctx.send(":no_entry: You do not have any available animated emote slots left in this server.");
      return;
    } else if (!url.endsWith(".gif") && !remStandard) {
      await ctx.send(":no_entry: You do not have any available normal emote slots left in this server.");
      return;
    }

    try {
      const fetched = await fetch(url, {
        size: 256 * 1000,
      });

      const data = await fetched.buffer();

      const created = await Bot.getInstance().client.createGuildEmoji(ctx.guildID, {
        name,
        image: `data:${fetched.headers.get("Content-Type")};base64,${data.toString("base64")}`,
      });

      await ctx.send(`:white_check_mark: Copied emote! \`:${created.name}:\``);
    } catch (err) {
      logger.error(err);
      await ctx.send(":x: Could not create the emoji. Make sure you specified a valid image under 256KiB.");
    }
  }
}

export = UploadCommand;
