import { Command } from "../lib/command";
import eris from "eris";
import Constants from "../Constants";

export class HelpCommand extends Command {
  constructor() {
    super({
      name: "help",
      aliases: [],
      checks: {
        "Bot must have 'Embed Links' permission.": message => message.channel.permissionsOf(this.bot.client.user.id).has("embedLinks"),
      },
    });
  }

  async run(message: eris.Message): Promise<void> {
    await this.bot.client.createMessage(message.channel.id, {
      embed: {
        color: 0xf5f5f5,
        title: `Remoji - Discord Emoji Manager`,
        thumbnail: {
          url: this.bot.client.user.dynamicAvatarURL("png"),
        },
        description: `Remoji provides a few, easy-to-use commands.`,
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
          text: `Remoji version ${Constants.version} ${Constants.git.branch}-${Constants.git.commit}`,
        },
      },
    });
  }
}
