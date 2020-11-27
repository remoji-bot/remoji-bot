import eris from "eris";
import logger from "./lib/logger";
import dotenv from "dotenv-safe";
import * as parser from "discord-command-parser";
import { time, randomChoice } from "./lib/utils";
import { stripIndents } from "common-tags";
import got from "got";
import fetch from "node-fetch";
import Constants from "./Constants";

dotenv.config();

declare const process: NodeJS.Process & {
  env: {
    DISCORD_TOKEN: string;
  };
};

const client = new eris.Client(process.env.DISCORD_TOKEN, {
  intents:
    eris.Constants.Intents.guilds |
    eris.Constants.Intents.guildMessages |
    eris.Constants.Intents.guildMessageReactions |
    eris.Constants.Intents.guildEmojis,
  allowedMentions: {
    everyone: false,
    roles: false,
    users: true,
  },
});

const commands: {
  [name: string]: (ctx: {
    msg: eris.Message<eris.TextChannel> & { guildID: string };
    parsed: parser.SuccessfulParsedMessage<eris.Message<eris.TextChannel> & { guildID: string }>;
  }) => Promise<void>;
} = {
  ping: async ({ msg }) => {
    const [elapsed, reply] = await time(() => client.createMessage(msg.channel.id, "Pong!"));
    await reply.edit(stripIndents`
        Pong!
        Message Edit: ${elapsed}ms
        Websocket: ${Math.floor(client.shards.reduce((a, s) => a + s.latency, 0) / client.shards.size)}ms`);
  },

  help: async ({ msg }) => {
    if (!msg.channel.guild.permissionsOf(client.user.id).has("embedLinks")) {
      await client.createMessage(msg.channel.id, ":confused: The bot needs the **Embed Links** permission to send the help page.");
      return;
    }
    await client.createMessage(msg.channel.id, {
      embed: {
        color: 0xf5f5f5,
        title: `${client.user.username} - Discord Emoji Manager`,
        thumbnail: {
          url: client.user.dynamicAvatarURL("png"),
        },
        description: `${client.user.username} provides a few, easy-to-use commands.`,
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
            name: "\u200b",
            value: "\u200b",
          },
          {
            name: "Need more help?",
            value: `[Join the support server](${Constants.supportServerInvite})`,
            inline: true,
          },
          {
            name: `Invite ${client.user.username}`,
            value: `[Add to your server](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=${Constants.requiredPermissions}&scope=bot)`,
            inline: true,
          },
        ],
        footer: {
          text: `${client.user.username} version ${Constants.version} ${Constants.git.branch}-${Constants.git.commit}`,
        },
        author: {
          url: "https://shino.live",
          name: "Created by Shino",
          icon_url: "https://shino.live/images/shinoheart.png",
        },
      },
    });
  },

  copy: async ({ msg, parsed }) => {
    if (!msg.member?.permissions.has("manageEmojis")) {
      await client.createMessage(msg.channel.id, ":x: You need to have the **Manage Emojis** permission to do this!");
      return;
    }

    if (!msg.channel.permissionsOf(client.user.id).has("manageEmojis")) {
      await client.createMessage(msg.channel.id, ":x: The bot needs to have the **Manage Emojis** permission to do this!");
      return;
    }

    const emoji = parsed.reader.getString(false, v => /^<(a?):\w+:[0-9]+>$/.test(v));
    const name = parsed.reader.getString(false, v => /^\w+$/.test(v));

    if (!emoji || !name) {
      await client.createMessage(msg.channel.id, ":x: Please specify a valid (custom) emoji and name.");
      return;
    }

    const emojiID = emoji.match(/^<(a?):\w+:([0-9]+)>$/);

    if (!emojiID?.[2]) {
      await client.createMessage(msg.channel.id, ":x: Could not find that emoji.");
      return;
    }

    const emoteURL = `https://cdn.discordapp.com/emojis/${emojiID[2]}.${emojiID[1] ? "gif" : "png"}`;

    const reply = await client.createMessage(msg.channel.id, ":hourglass: Downloading...");

    const fetched = await got(emoteURL, {
      throwHttpErrors: false,
    });

    if (fetched.statusCode !== 200) {
      await reply.edit(":no_entry: An error occurred while trying to download that emote.");
    }

    await reply.edit(":hourglass: Uploading...");

    const created = await client.createGuildEmoji(msg.guildID, {
      name,
      image: `data:${fetched.headers["content-type"]};base64,${fetched.rawBody.toString("base64")}`,
    });

    await reply.edit(`:white_check_mark: Uploaded emoji \`:${created.name}:\``);
  },

  download: async ({ msg, parsed }) => {
    const emoji = parsed.reader.getString(false, v => /^<(a?):\w+:[0-9]+>$/.test(v));

    if (!emoji) {
      await client.createMessage(msg.channel.id, ":x: Please specify a valid (custom) emoji.");
      return;
    }

    const emojiID = emoji.match(/^<(a?):(\w+):([0-9]+)>$/);

    if (!emojiID?.[3]) {
      await client.createMessage(msg.channel.id, ":x: Could not find that emoji.");
      return;
    }

    const emoteURL = `https://cdn.discordapp.com/emojis/${emojiID[3]}.${emojiID[1] ? "gif" : "png"}`;

    const reply = await client.createMessage(msg.channel.id, ":hourglass: Downloading...");

    const fetched = await got(emoteURL, {
      throwHttpErrors: false,
    });

    if (fetched.statusCode !== 200) {
      await reply.edit(":no_entry: An error occurred while trying to download that emote.");
    }

    await reply.edit(":hourglass: Uploading...");

    await client.createMessage(
      msg.channel.id,
      {
        content: stripIndents`
          Name: ${emojiID[2]}
          Animated: ${emojiID[1] ? "Yes" : "No"}
          ID: ${emojiID[3]}
          URL: <${emoteURL}>`,
      },
      {
        file: fetched.rawBody,
        name: `${emojiID[2]}.${emojiID[1] ? "gif" : "png"}`,
      },
    );

    await reply.delete();
  },

  upload: async ({ msg, parsed }) => {
    if (!msg.member?.permissions.has("manageEmojis")) {
      await client.createMessage(msg.channel.id, ":x: You need to have the **Manage Emojis** permission to do this!");
      return;
    }

    if (!msg.channel.permissionsOf(client.user.id).has("manageEmojis")) {
      await client.createMessage(msg.channel.id, ":x: The bot needs to have the **Manage Emojis** permission to do this!");
      return;
    }

    const name = parsed.reader.getString(false, v => /^\w+$/.test(v));
    const url =
      parsed.reader.getString(false, v =>
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(v),
      ) ?? msg.attachments[0]?.proxy_url;

    if (!name || !url) {
      await client.createMessage(msg.channel.id, ":x: Please specify a valid name and image (URL or upload).");
      return;
    }

    const reply = await client.createMessage(msg.channel.id, ":hourglass: Downloading...");

    try {
      const fetched = await fetch(url, {
        size: 256 * 1000,
      });

      await reply.edit(":hourglass: Uploading...");

      const created = await client.createGuildEmoji(msg.guildID, {
        name,
        image: `data:${fetched.headers.get("Content-Type") || "image/png"};base64,${(await fetched.buffer()).toString("base64")}`,
      });

      await reply.edit(`:white_check_mark: Uploaded emoji \`:${created.name}:\``);
    } catch (err) {
      logger.error(err);
      await reply.edit(":no_entry: Could not create the emoji. Make sure you specified a valid image under 256KB.");
    }
  },

  list: async ({ msg }) => {
    const descs: string[] = [];
    let s = "";
    for (const emoji of msg.channel.guild.emojis.sort((a, b) => a.name.localeCompare(b.name))) {
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
        await client.createMessage(msg.channel.id, {
          embed: {
            color: 0xf5f5f5,
            description: desc,
          },
        });
    } else {
      await client.createMessage(msg.channel.id, {
        embed: {
          color: 0xf5f5f5,
          description: "No emotes exist in this server... *yet*",
        },
      });
    }
  },
};

client.on(
  "messageCreate",
  async (
    msg: eris.Message<eris.TextChannel> & {
      guildID: string;
    },
  ) => {
    const parsed = parser.parse(msg, "e/");
    if (!parsed.success || !msg.guildID) return;
    const handler = Object.entries(commands).find(c => c[0].toLowerCase() === parsed.command.toLowerCase());
    if (handler) {
      try {
        await handler[1]({
          msg,
          parsed,
        });
      } catch (err) {
        logger.error(err);
        await client.createMessage(
          msg.channel.id,
          ":no_entry: Something went wrong... Try making sure that the bot has appropriate permissions granted to it. You may also join our support server for more help. Click the support server link in the help command.",
        );
      }
    }
  },
);

client.on("ready", () => {
  logger.info(`READY as ${client.user.username} in ${client.guilds.size} guild(s)`);
  function editStatus() {
    client.editStatus("online", randomChoice(Constants.stati));
  }
  setInterval(editStatus, 1000 * 60 * 5).unref();
  editStatus();
});

process.on("unhandledRejection", e => logger.error(e));
process.on("uncaughtException", e => logger.error(e));

void client.connect();
