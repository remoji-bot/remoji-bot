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

import { SlashCommand, SlashCreator, CommandContext } from "slash-create";

import { Bot } from "../lib/bot";
import { getRemainingGuildEmoteSlots, EmbedBuilder, EmbedUtil } from "../lib/utils";

export default class ListCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "list",
      description: "Lists emotes in the current server",
    });
    this.filePath = __filename;
  }

  async run(ctx: CommandContext): Promise<void | string> {
    if (!ctx.guildID) {
      await ctx.send(":x: This command may only be used in a server.");
      return;
    }

    await ctx.defer();

    const bot = Bot.getInstance();

    const emotes = bot.client.guilds.get(ctx.guildID)?.emojis ?? (await bot.client.getRESTGuildEmojis(ctx.guildID));
    const [remStandard, remAnimated] = await getRemainingGuildEmoteSlots(bot.client, ctx.guildID);

    const regular = emotes.filter(emote => !emote.animated).sort((a, b) => a.name.localeCompare(b.name));
    const animated = emotes.filter(emote => emote.animated).sort((a, b) => a.name.localeCompare(b.name));

    let page = "";

    const regularPages: string[] = [];
    const animatedPages: string[] = [];

    const embeds: EmbedBuilder[] = [];

    for (const emote of regular) {
      const append = ` <:_:${emote.id}> \`:${emote.name}:\`\n`;
      if (page.length + append.length > 1024) {
        regularPages.push(page);
        page = append.trim() + "\n";
      } else {
        page += append;
      }
    }
    if (page) regularPages.push(page);
    page = "";

    for (const emote of animated) {
      const append = ` <a:_:${emote.id}> \`:${emote.name}:\`\n`;
      if (page.length + append.length > 1024) {
        animatedPages.push(page);
        page = append.trim() + "\n";
      } else {
        page += append;
      }
    }
    if (page) animatedPages.push(page);
    page = "";

    let embed;
    if (regular.length) {
      embed = EmbedUtil.success().setTitle("Regular Emotes");
      for (const page of regularPages.splice(0, 5)) embed.addField("\u200b", page, true);
      embeds.push(embed);

      while (regularPages.length > 0) {
        embed = EmbedUtil.successFollowup();
        for (const page of regularPages.splice(0, 5)) embed.addField("\u200b", page, true);
        embeds.push(embed);
      }
    } else {
      embeds.push(EmbedUtil.success("None! *yet...*").setTitle("Regular Emotes"));
    }
    embeds[embeds.length - 1].setFooter(`${regular.length} regular emotes (${remStandard} slots available)`);

    if (animated.length) {
      embed = EmbedUtil.successFollowup().setTitle("Animated Emotes");
      for (const page of animatedPages.splice(0, 5)) embed.addField("\u200b", page, true);
      embeds.push(embed);

      while (animatedPages.length > 0) {
        embed = EmbedUtil.successFollowup();
        for (const page of animatedPages.splice(0, 5)) embed.addField("\u200b", page, true);
        embeds.push(embed);
      }
    } else {
      embeds.push(EmbedUtil.successFollowup("None! *yet...*").setTitle("Animated Emotes"));
    }
    embeds[embeds.length - 1].setFooter(`${animated.length} animated emotes (${remAnimated} slots available)`);

    while (embeds.length) await ctx.send({ embeds: [embeds.shift()] });
  }
}
