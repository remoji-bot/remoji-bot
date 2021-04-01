import { ok as assert } from "assert";

import eris from "eris";
import * as parser from "discord-command-parser";
import { Bot } from "./bot";
import { ErisPermissionKeys } from "./utils";

type CommandCheck = (m: eris.Message<eris.GuildTextableChannel>) => boolean | Promise<boolean>;

export function permissionCheck(permissions: ErisPermissionKeys[]): CommandCheck {
  return message => permissions.every(permission => message.member?.permissions.has(permission as string));
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
    for (const [name, check] of this.checks) if (!(await check(parsed.message))) return { success: false, reason: name };
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
