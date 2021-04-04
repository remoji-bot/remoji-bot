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
import { Embed } from "eris";

import { Bot } from "../lib/bot";
import { getGuildEmotes, getRemainingGuildEmoteSlots } from "../lib/utils";

class ListCommand extends SlashCommand {
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

    const emotes = await getGuildEmotes(Bot.getInstance().client, ctx.guildID);
    const [remStandard, remAnimated] = await getRemainingGuildEmoteSlots(Bot.getInstance().client, ctx.guildID);

    const regular = emotes.filter(emote => !emote.animated).sort((a, b) => a.name.localeCompare(b.name));
    const animated = emotes.filter(emote => emote.animated).sort((a, b) => a.name.localeCompare(b.name));

    let page = "";

    const regularPages: string[] = [];
    const animatedPages: string[] = [];

    const embeds: Embed[] = [];

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

    if (regular.length) {
      embeds.push({
        type: "rich",
        title: "Regular Emotes",
        fields: regularPages.splice(0, 5).map(page => ({ name: "\u200b", value: page, inline: true })),
      });
      while (regularPages.length > 0) {
        embeds.push({
          type: "rich",
          fields: regularPages.splice(0, 5).map(page => ({ name: "\u200b", value: page, inline: true })),
        });
      }
    } else {
      embeds.push({
        type: "rich",
        title: "Regular Emotes",
        description: "None! *yet*",
      });
    }
    embeds[embeds.length - 1].footer = {
      text: `${regular.length} regular emotes (${remStandard} slots available)`,
    };

    if (animated.length) {
      embeds.push({
        type: "rich",
        title: "Animated Emotes",
        fields: animatedPages.splice(0, 5).map(page => ({ name: "\u200b", value: page, inline: true })),
      });
      while (animatedPages.length > 0) {
        embeds.push({
          type: "rich",
          fields: animatedPages.splice(0, 5).map(page => ({ name: "\u200b", value: page, inline: true })),
        });
      }
      embeds[embeds.length - 1].footer = {
        text: `${animated.length} animated emotes (${remAnimated} slots available)`,
      };
    } else {
      embeds.push({
        type: "rich",
        title: "Animated Emotes",
        description: "None! *yet*",
      });
    }
    embeds[embeds.length - 1].footer = {
      text: `${animated.length} animated emotes (${remAnimated} slots available)`,
    };

    await ctx.send({ embeds });
  }
}

export = ListCommand;
