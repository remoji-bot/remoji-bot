import { Nullable } from '@remoji-bot/core';
import { APIInteractionDataResolvedGuildMember, APIRole } from 'discord-api-types';
import { Collection, CommandInteractionOption, GuildChannel, GuildMember, Role, User } from 'discord.js';

/**
 * A resolver for `CommandInteractionOption` collections.
 */
export class CommandOptionResolver {
	public readonly options: Collection<string, CommandInteractionOption>;

	public constructor(options: Collection<string, CommandInteractionOption>) {
		this.options = options;
	}

	public get(name: string, required: true): CommandInteractionOption;
	public get(name: string, required: boolean): Nullable<CommandInteractionOption>;
	/**
	 * Safely gets an option from the collection.
	 *
	 * @param name - The option name
	 * @param required - Whether to assert the option's presence
	 * @returns - The option, or null if absent and not required
	 */
	public get(name: string, required: boolean): Nullable<CommandInteractionOption> {
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
	public subcommand(name: string): CommandOptionResolver | null {
		const option = this.get(name, false);
		if (option && !(option.type === 'SUB_COMMAND' || option.type === 'SUB_COMMAND_GROUP'))
			throw new TypeError(`Non-subcommand value in subcommand option: ${name}`);
		if (!option) return null;
		return new CommandOptionResolver(option.options ?? new Collection<string, CommandInteractionOption>());
	}

	public string<T extends string = string>(name: string, required?: true): T;
	public string<T extends string = string>(name: string, required: boolean): Nullable<T>;
	/**
	 * Gets `name` as a string option.
	 *
	 * @param name - The option name
	 * @param required - Whether to assert the option's presence
	 * @returns - The value, or null if absent and not required
	 */
	public string<T extends string = string>(name: string, required = true): Nullable<T> {
		const option = this.get(name, required);
		if (option && typeof option.value !== 'string') throw new TypeError(`Non-string value in string option: ${name}`);
		return (option?.value as T | undefined) ?? null;
	}

	public number<T extends number = number>(name: string, required?: true): T;
	public number<T extends number = number>(name: string, required: boolean): Nullable<T>;
	/**
	 * Gets `name` as a number option.
	 *
	 * @param name - The option name
	 * @param required - Whether to assert the option's presence
	 * @returns - The value, or null if absent and not required
	 */
	public number<T extends number = number>(name: string, required = true): Nullable<T> {
		const option = this.get(name, required);
		if (option && typeof option.value !== 'number') throw new TypeError(`Non-number value in number option: ${name}`);
		return (option?.value as T | undefined) ?? null;
	}

	public boolean<T extends boolean = boolean>(name: string, required?: true): T;
	public boolean<T extends boolean = boolean>(name: string, required: boolean): Nullable<T>;
	/**
	 * Gets `name` as a boolean option.
	 *
	 * @param name - The option name
	 * @param required - Whether to assert the option's presence
	 * @returns - The value, or null if absent and not required
	 */
	public boolean<T extends boolean = boolean>(name: string, required = true): Nullable<T> {
		const option = this.get(name, required);
		if (option && typeof option.value !== 'boolean')
			throw new TypeError(`Non-boolean value in boolean option: ${name}`);
		return (option?.value as T | undefined) ?? null;
	}

	public channel(name: string, required?: true): GuildChannel;
	public channel(name: string, required: boolean): Nullable<GuildChannel>;
	/**
	 * Gets `name` as a channel option.
	 *
	 * @param name - The option name
	 * @param required - Whether to assert the option's presence
	 * @returns - The value, or null if absent and not required
	 */
	public channel(name: string, required = true): Nullable<GuildChannel> {
		const option = this.get(name, required);
		if (option && !option.channel) throw new TypeError(`Non-channel value in channel option: ${name}`);
		const channel = option?.channel;
		if (option?.channel instanceof GuildChannel) return channel as GuildChannel;
		return null;
	}

	public member(name: string, required?: true): GuildMember | APIInteractionDataResolvedGuildMember;
	public member(name: string, required: boolean): Nullable<GuildMember | APIInteractionDataResolvedGuildMember>;
	/**
	 * Gets `name` as a member option.
	 *
	 * @param name - The option name
	 * @param required - Whether to assert the option's presence
	 * @returns - The value, or null if absent and not required
	 */
	public member(name: string, required = true): Nullable<GuildMember | APIInteractionDataResolvedGuildMember> {
		const option = this.get(name, required);
		if (option && !option.member) throw new TypeError(`Non-member value in member option: ${name}`);
		return option?.member ?? null;
	}

	public role(name: string, required?: true): Role | APIRole;
	public role(name: string, required: boolean): Nullable<Role | APIRole>;
	/**
	 * Gets `name` as a role option.
	 *
	 * @param name - The option name
	 * @param required - Whether to assert the option's presence
	 * @returns - The value, or null if absent and not required
	 */
	public role(name: string, required = true): Nullable<Role | APIRole> {
		const option = this.get(name, required);
		if (option && !option.role) throw new TypeError(`Non-role value in role option: ${name}`);
		return option?.role ?? null;
	}

	public user(name: string, required?: true): User;
	public user(name: string, required: boolean): Nullable<User>;
	/**
	 * Gets `name` as a user option.
	 *
	 * @param name - The option name
	 * @param required - Whether to assert the option's presence
	 * @returns - The value, or null if absent and not required
	 */
	public user(name: string, required = true): Nullable<User> {
		const option = this.get(name, required);
		if (option && !option.user) throw new TypeError(`Non-user value in user option: ${name}`);
		return option?.user ?? null;
	}
}
