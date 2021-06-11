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

import Constants from "../Constants";
import { Bot } from "../lib/bot";
import { EmbedUtil } from "../lib/utils";

export default class InfoCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "info",
      description: "Sends information about the bot",
    });
    this.filePath = __filename;
  }

  async run(ctx: CommandContext): Promise<void> {
    const embed = EmbedUtil.info()
      .setTitle("Bot Info")
      .setThumbnail(Bot.getInstance().client.user.dynamicAvatarURL("png"))
      .setDescription(
        "Remoji is a super-simple but super-powerful emote manager bot for Discord. Among other features, Remoji allows you to ~~steal~~ *copy* or upload emotes to your server from directly in Discord, even on mobile!",
      )
      .addField(
        "Join Remoji's Discord server to stay up-to-date with new features!",
        `**[JOIN REMOJI'S DISCORD](${Constants.supportServerInvite})**`,
      )
      .addField(
        "Invite Remoji",
        `**[INVITE](https://discord.com/oauth2/authorize?client_id=${ctx.creator.options.applicationID}&permissions=${Constants.requiredPermissions}&scope=applications.commands%20bot)**`,
        true,
      )
      .addField("Vote for Remoji", `**[VOTE ON TOP.GG](${Constants.topGG})**`, true)
      .addField(
        "Created by Shino",
        "[GitHub](https://github.com/shinotheshino)  |  [Patreon](https://patreon.com/shinotheshino)  |  [Twitch](https://twitch.tv/shinotheshino)",
      )
      .setFooter(`Remoji version ${Constants.version} ${Constants.git.branch}-${Constants.git.commit} - GNU AGPL 3.0`);

    await ctx.send({ embeds: [embed] });
  }
}
