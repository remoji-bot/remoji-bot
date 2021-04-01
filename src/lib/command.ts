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
import { ok as assert } from "assert";

import eris from "eris";
import * as parser from "discord-command-parser";
import { Bot } from "./bot";
import { ErisPermissionKeys } from "./utils";

type CommandCheck = (m: eris.Message<eris.GuildTextableChannel>, b: Bot) => boolean | Promise<boolean>;

export function userPermissionCheck(permissions: ErisPermissionKeys[]): CommandCheck {
  return message => permissions.every(permission => message.member?.permissions.has(permission));
}

export function botPermissionCheck(permissions: ErisPermissionKeys[]): CommandCheck {
  return (message, bot) => permissions.every(permission => message.channel.permissionsOf(bot.client.user.id).has(permission));
}

export type CommandResult = { success: true } | { success: false; error: Error } | { success: false; reason: string };

interface CommandProperties {
  name: string;
  aliases: string[];
  checks: Map<string, CommandCheck> | Record<string, CommandCheck>;
}

export abstract class Command {
  readonly name: string;
  readonly aliases: readonly string[];
  readonly checks: ReadonlyMap<string, CommandCheck>;

  #initialized = false;
  #bot: Bot | undefined = void 0;

  constructor(properties: CommandProperties) {
    this.name = properties.name;
    this.aliases = properties.aliases.slice();
    this.checks = new Map(properties.checks instanceof Map ? properties.checks : Object.entries(properties.checks));
  }

  get bot(): Bot {
    assert(this.#initialized && this.#bot, "Illegal access to bot field prior to init() being called.");
    return this.#bot;
  }

  async __initialize(bot: Bot): Promise<void> {
    assert(!this.#initialized, "Cannot re-initialize Command.");
    this.#initialized = true;
    this.#bot = bot;
    await this.init();
  }

  protected init(): void | Promise<void> {
    void 0;
  }

  async __execute(parsed: parser.SuccessfulParsedMessage<eris.Message<eris.GuildTextableChannel>>): Promise<CommandResult> {
    for (const [name, check] of this.checks) if (!(await check(parsed.message, this.bot))) return { success: false, reason: name };
    try {
      const result = await this.run(parsed.message, parsed.reader, parsed);
      return result || { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  protected abstract run(
    message: eris.Message,
    args: parser.MessageArgumentReader,
    parsed: parser.SuccessfulParsedMessage<eris.Message<eris.GuildTextableChannel>>,
  ): Promise<CommandResult | void>;
}
