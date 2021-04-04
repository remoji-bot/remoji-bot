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

class InfoCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "info",
      description: "Sends information about the bot",
    });
    this.filePath = __filename;
  }

  async run(ctx: CommandContext): Promise<void> {
    await ctx.send({
      embeds: [
        {
          color: 0xf5f5f5,
          title: "Remoji - Discord Emoji Manager",
          thumbnail: {
            url: Bot.getInstance().client.user.dynamicAvatarURL("png"),
          },
          description:
            "Remoji is a super-simple but super-powerful emote manager bot for Discord. Among other features, Remoji allows you to ~~steal~~ *copy* or upload emotes to your server from directly in Discord, even on mobile!",
          fields: [
            {
              name: "Join Remoji's Discord server to stay up-to-date with new features!",
              value: `**[JOIN](${Constants.supportServerInvite})**`,
              inline: false,
            },
            {
              name: `Invite Remoji`,
              value: `**[INVITE](https://discord.com/oauth2/authorize?client_id=${ctx.creator.options.applicationID}&permissions=${Constants.requiredPermissions}&scope=applications.commands%20bot)**`,
              inline: true,
            },
            {
              name: `Vote for Remoji`,
              value: `**[VOTE ON TOP.GG](${Constants.topGG})**`,
              inline: true,
            },
            {
              name: "Created by Shino",
              value:
                "[GitHub](https://github.com/shinotheshino)  |  [Patreon](https://patreon.com/shinotheshino)  |  [Twitch](https://twitch.tv/shinotheshino)",
            },
          ],
          footer: {
            text: `Remoji version ${Constants.version} ${Constants.git.branch}-${Constants.git.commit} - GNU AGPL 3.0`,
          },
        },
      ],
    });
  }
}

export = InfoCommand;
