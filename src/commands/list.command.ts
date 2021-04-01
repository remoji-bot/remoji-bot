import { Command, botPermissionCheck } from "../lib/command";
import eris from "eris";

export class ListCommand extends Command {
  constructor() {
    super({
      name: "list",
      aliases: [],
      checks: {
        "Bot must have 'Embed Links' permission.": botPermissionCheck(["embedLinks"]),
      },
    });
  }

  async run(message: eris.Message<eris.GuildTextableChannel>): Promise<void> {
    const descs: string[] = [];
    let s = "";

    for (const emoji of message.channel.guild.emojis.sort((a, b) => a.name.localeCompare(b.name))) {
      const line = ` <${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`;
      if (s.length + line.length > 2048) {
        descs.push(s);
        s = line.trim();
      } else {
        s += line;
      }
    }
    if (s) descs.push(s);
    if (descs.length > 0) {
      for (const desc of descs)
        await this.bot.client.createMessage(message.channel.id, {
          embed: {
            color: 0xf5f5f5,
            description: desc,
          },
        });
    } else {
      await this.bot.client.createMessage(message.channel.id, {
        embed: {
          color: 0xf5f5f5,
          description: "No emotes exist in this server... *yet*",
        },
      });
    }
  }
}
