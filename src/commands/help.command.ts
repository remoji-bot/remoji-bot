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
import { Command, botPermissionCheck } from "../lib/command";
import eris from "eris";
import Constants from "../Constants";

export class HelpCommand extends Command {
  constructor() {
    super({
      name: "help",
      aliases: [],
      checks: {
        "Bot must have 'Embed Links' permission.": botPermissionCheck(["embedLinks"]),
      },
    });
  }

  async run(message: eris.Message): Promise<void> {
    await this.bot.client.createMessage(message.channel.id, {
      embed: {
        color: 0xf5f5f5,
        title: "Remoji - Discord Emoji Manager",
        thumbnail: {
          url: this.bot.client.user.dynamicAvatarURL("png"),
        },
        description: "Remoji provides a few, easy-to-use commands.",
        fields: [
          {
            name: "`help`",
            value: "You're looking at it :)",
            inline: false,
          },
          {
            name: "`ping`",
            value: "Tests the bot's connection to Discord.",
            inline: false,
          },
          {
            name: "`copy <emoji> <name>`",
            value: "Downloads the image source for `emoji` and uploads it to the current server as `:name:`.",
            inline: false,
          },
          {
            name: "`download <emoji>`",
            value: "Posts the image source for `emoji`.",
            inline: false,
          },
          {
            name: "`upload <name> {uploaded image OR image URL}`",
            value:
              "Requries you to upload an image along with the command OR post a link to the image. Uploads the image to the current server as `:name:`.",
          },
          {
            name: "`list`",
            value: "Lists all emotes in the current server, sorted alphabetically.",
          },
          {
            name: "Need more help?",
            value: `**[SUPPORT](${Constants.supportServerInvite})**`,
            inline: true,
          },
          {
            name: `Invite Remoji`,
            value: `**[INVITE](https://discord.com/oauth2/authorize?client_id=${this.bot.client.user.id}&permissions=${Constants.requiredPermissions}&scope=applications.commands%20bot)**`,
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
    });
  }
}
