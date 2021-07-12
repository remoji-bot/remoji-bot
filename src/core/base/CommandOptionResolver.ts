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

import { Collection, CommandInteractionOption, GuildChannel, GuildMember, Role, User } from "discord.js";
import { APIInteractionDataResolvedGuildMember, APIRole } from "discord-api-types";

import { Nullable } from "@remoji-bot/core";

/**
 * A resolver for `CommandInteractionOption` collections.
 */
export class CommandOptionResolver {
  readonly options: Collection<string, CommandInteractionOption>;

  constructor(options: Collection<string, CommandInteractionOption>) {
    this.options = options;
  }

  get(name: string, required: true): CommandInteractionOption;
  get(name: string, required: boolean): Nullable<CommandInteractionOption>;
  /**
   * Safely gets an option from the collection.
   *
   * @param name - The option name
   * @param required - Whether to assert the option's presence
   * @returns - The option, or null if absent and not required
   */
  get(name: string, required: boolean): Nullable<CommandInteractionOption> {
    const option = this.options.get(name);
    if (!option && required) throw new TypeError(`Could not resolve option: ${name}`);
    return option ?? null;
  }

  /**
   * Gets `name` as a subcommand using a `CommandOptionResolver`.
   *
   * @param name - The subcommand name
   * @returns - The subcommand resolver
   */
  subcommand(name: string): CommandOptionResolver | null {
    const option = this.get(name, false);
    if (option && !(option.type === "SUB_COMMAND" || option.type === "SUB_COMMAND_GROUP"))
      throw new TypeError(`Non-subcommand value in subcommand option: ${name}`);
    if (!option) return null;
    return new CommandOptionResolver(option.options ?? new Collection<string, CommandInteractionOption>());
  }

  string<T extends string = string>(name: string, required?: true): T;
  string<T extends string = string>(name: string, required: boolean): Nullable<T>;
  /**
   * Gets `name` as a string option.
   *
   * @param name - The option name
   * @param required - Whether to assert the option's presence
   * @returns - The value, or null if absent and not required
   */
  string<T extends string = string>(name: string, required = true): Nullable<T> {
    const option = this.get(name, required);
    if (option && typeof option.value !== "string") throw new TypeError(`Non-string value in string option: ${name}`);
    return (option?.value as T) ?? null;
  }

  number<T extends number = number>(name: string, required?: true): T;
  number<T extends number = number>(name: string, required: boolean): Nullable<T>;
  /**
   * Gets `name` as a number option.
   *
   * @param name - The option name
   * @param required - Whether to assert the option's presence
   * @returns - The value, or null if absent and not required
   */
  number<T extends number = number>(name: string, required = true): Nullable<T> {
    const option = this.get(name, required);
    if (option && typeof option.value !== "number") throw new TypeError(`Non-number value in number option: ${name}`);
    return (option?.value as T) ?? null;
  }

  boolean<T extends boolean = boolean>(name: string, required?: true): T;
  boolean<T extends boolean = boolean>(name: string, required: boolean): Nullable<T>;
  /**
   * Gets `name` as a boolean option.
   *
   * @param name - The option name
   * @param required - Whether to assert the option's presence
   * @returns - The value, or null if absent and not required
   */
  boolean<T extends boolean = boolean>(name: string, required = true): Nullable<T> {
    const option = this.get(name, required);
    if (option && typeof option.value !== "boolean")
      throw new TypeError(`Non-boolean value in boolean option: ${name}`);
    return (option?.value as T) ?? null;
  }

  channel(name: string, required?: true): GuildChannel;
  channel(name: string, required: boolean): Nullable<GuildChannel>;
  /**
   * Gets `name` as a channel option.
   *
   * @param name - The option name
   * @param required - Whether to assert the option's presence
   * @returns - The value, or null if absent and not required
   */
  channel(name: string, required = true): Nullable<GuildChannel> {
    const option = this.get(name, required);
    if (option && !option.channel) throw new TypeError(`Non-channel value in channel option: ${name}`);
    const channel = option?.channel;
    if (option?.channel instanceof GuildChannel) return channel as GuildChannel;
    return null;
  }

  member(name: string, required?: true): GuildMember | APIInteractionDataResolvedGuildMember;
  member(name: string, required: boolean): Nullable<GuildMember | APIInteractionDataResolvedGuildMember>;
  /**
   * Gets `name` as a member option.
   *
   * @param name - The option name
   * @param required - Whether to assert the option's presence
   * @returns - The value, or null if absent and not required
   */
  member(name: string, required = true): Nullable<GuildMember | APIInteractionDataResolvedGuildMember> {
    const option = this.get(name, required);
    if (option && !option.member) throw new TypeError(`Non-member value in member option: ${name}`);
    return option?.member ?? null;
  }

  role(name: string, required?: true): Role | APIRole;
  role(name: string, required: boolean): Nullable<Role | APIRole>;
  /**
   * Gets `name` as a role option.
   *
   * @param name - The option name
   * @param required - Whether to assert the option's presence
   * @returns - The value, or null if absent and not required
   */
  role(name: string, required = true): Nullable<Role | APIRole> {
    const option = this.get(name, required);
    if (option && !option.role) throw new TypeError(`Non-role value in role option: ${name}`);
    return option?.role ?? null;
  }

  user(name: string, required?: true): User;
  user(name: string, required: boolean): Nullable<User>;
  /**
   * Gets `name` as a user option.
   *
   * @param name - The option name
   * @param required - Whether to assert the option's presence
   * @returns - The value, or null if absent and not required
   */
  user(name: string, required = true): Nullable<User> {
    const option = this.get(name, required);
    if (option && !option.user) throw new TypeError(`Non-user value in user option: ${name}`);
    return option?.user ?? null;
  }
}
