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
import { Command } from "./command";
import eris, { GuildChannel, GuildTextableChannel, PrivateChannel } from "eris";
import * as parser from "discord-command-parser";
import logger from "./logger";

export interface BotOptions {
  token: string;
  erisOptions?: eris.ClientOptions;
}

export class Bot {
  readonly client: eris.Client;

  protected readonly commands = new Set<Command>();
  protected ready = false;

  constructor(options: BotOptions) {
    this.client = new eris.Client(options.token, options.erisOptions);
    this.client.on("messageCreate", this.onMessage.bind(this));
    this.client.once("ready", this.onReady.bind(this));
    this.client.on("error", this.onError.bind(this));
  }

  addCommand(command: Command): this {
    this.commands.add(command);
    if (this.ready) void command.__initialize(this);
    return this;
  }

  private async onMessage(message: eris.Message): Promise<void> {
    if (!this.ready || !(message.channel instanceof GuildChannel) || message.channel instanceof PrivateChannel) return;
    const parsed = parser.parse(message as eris.Message<GuildTextableChannel>, "e/", {
      ignorePrefixCase: true,
      allowSpaceBeforeCommand: true,
    });
    if (!parsed.success) return;
    for (const command of this.commands) {
      if (command.name.toLowerCase() === parsed.command.toLowerCase()) {
        logger.info(
          `*${message.guildID} > #${message.channel.id} > @${message.author.id} (${message.author.username}#${message.author.discriminator}) used command '${command.name}'`,
        );
        const result = await command.__execute(parsed);
        if (!result.success) {
          if ("error" in result) {
            try {
              await message.channel.createMessage(":x: An error occurred while running this command!");
            } catch (error) {
              logger.error(error);
            } finally {
              logger.error(result.error);
            }
          } else {
            try {
              await message.channel.createMessage(`:x: Command failed: ${result.reason}`);
            } catch (error) {
              logger.error(error);
            }
          }
        }
        break;
      }
    }
  }

  private async onReady() {
    await Promise.all([...this.commands].map(command => command.__initialize(this)));
    this.ready = true;
  }

  private onError(error: Error): void {
    logger.error(error);
  }

  async login(): Promise<void> {
    await this.client.connect();
  }
}