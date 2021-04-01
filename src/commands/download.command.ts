import { Command, botPermissionCheck, userPermissionCheck, CommandResult } from "../lib/command";
import eris from "eris";
import { MessageArgumentReader } from "discord-command-parser";
import got from "got";
import { stripIndents } from "common-tags";

export class DownloadCommand extends Command {
  constructor() {
    super({
      name: "download",
      aliases: [],
      checks: {
        "User must have 'Attach Files' permission.": userPermissionCheck(["attachFiles"]),
        "Bot must have 'Attach Files' permission.": botPermissionCheck(["attachFiles"]),
      },
    });
  }

  async run(message: eris.Message<eris.GuildTextableChannel>, args: MessageArgumentReader): Promise<CommandResult | void> {
    const emoji = args.getString(false, v => /^<(a?):\w+:[0-9]+>$/.test(v));

    if (!emoji) {
      return { success: false, reason: "Specify a valid (custom) emoji." };
    }

    const emojiMatch = emoji.match(/^<(a?):\w+:([0-9]+)>$/);

    if (!emojiMatch?.[2]) {
      return { success: false, reason: "Could not find the specified emoji." };
    }

    const emoteURL = `https://cdn.discordapp.com/emojis/${emojiMatch[2]}.${emojiMatch[1] ? "gif" : "png"}`;

    let content = ":hourglass: Downloading...";
    const reply = await message.channel.createMessage(content);

    const fetched = await got(emoteURL, {
      throwHttpErrors: false,
    });

    if (fetched.statusCode !== 200) {
      return { success: false, reason: "An error occurred while trying to download that emote." };
    }

    content = content.split(":hourglass:").join(":white_check_mark:") + " Done!\n:hourglass: Uploading...";
    await reply.edit(content);

    await message.channel.createMessage(
      {
        content: stripIndents`
          **Name**: \`${emojiMatch[0]}\`
          **Animated**: ${emojiMatch[1] ? "Yes" : "No"}
          **ID**: \`${emojiMatch[2]}\`
          **URL**: <${emoteURL}>`,
      },
      {
        file: fetched.rawBody,
        name: `${emojiMatch[2]}.${emojiMatch[1] ? "gif" : "png"}`,
      },
    );

    await reply.delete();
  }
}
