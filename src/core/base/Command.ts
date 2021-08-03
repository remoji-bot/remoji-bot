import assert from 'assert';
import { Logger, Nullable } from '@remoji-bot/core';
import * as discord from 'discord.js';
import { CommandContext } from './CommandContext';
import environment from '../../environment';
import { Bot } from '../Bot';

export interface CommandOptions<GUILD extends boolean> {
	guildOnly: GUILD;

	developerOnly?: boolean;
	voterOnly?: boolean;
	premium?: boolean;

	userPermissions?: discord.PermissionResolvable;
	botPermissions?: discord.PermissionResolvable;
}

/**
 * The basic abstract class for all commands.
 */
export abstract class Command<GUILD extends boolean = boolean> {
	public readonly data: Readonly<discord.ApplicationCommandData>;
	public readonly bot = Bot.getInstance();
	public readonly logger: Logger;

	public readonly options: Readonly<CommandOptions<GUILD>>;

	public constructor(data: discord.ApplicationCommandData, options: CommandOptions<GUILD>) {
		this.logger = Logger.getLogger(`command/${data.name}`);
		this.data = data;
		this.options = options;
		assert(this._run === Command.prototype._run, 'Command#_run must not be overridden');
	}

	/**
	 * Checks for the given required permissions.
	 *
	 * @param required - The permissions to check for
	 * @param given - The permissions that were supplied
	 * @returns The missing permissions, if any, otherwise null
	 */
	private _checkPermissions(
		required: Nullable<discord.PermissionResolvable>,
		given: Nullable<discord.PermissionResolvable>,
	): Nullable<discord.Permissions> {
		const missing = new discord.Permissions(new discord.Permissions(given ?? 0n).missing(required ?? 0n));
		return missing.bitfield > 0 ? missing : null;
	}

	/**
	 * Internal method for running a command. Marked private to disallow override.
	 * Called via index accessor in interaction event.
	 *
	 * @param ctx - The context to execute
	 * @returns void
	 */
	private async _run(ctx: CommandContext): Promise<void> {
		if (this.options.developerOnly && !ctx.isDeveloper()) {
			await ctx.error(':x: You must be a developer to run this command.');
			return;
		}

		if (this.options.guildOnly && !ctx.interaction.guild) {
			this.logger.error(`guildOnly command ${this.data.name} was run outside of a guild`);
			await ctx.error(`:x: This command can only be used in a server!`);
			return;
		}

		// TODO: maybe use Promise.all, pass interaction and fetch members if needed in _checkPermissions
		const [missingPermsUser, missingPermsBot] = [
			ctx.interaction.guild &&
				this._checkPermissions(this.options.userPermissions ?? null, ctx.interaction.member.permissions as `${bigint}`),
			ctx.interaction.guild &&
				this._checkPermissions(this.options.botPermissions ?? null, ctx.interaction.guild.me?.permissions ?? null),
		];

		if (missingPermsUser) {
			await ctx.error(
				`**You** need the following permissions to run this command:
        ${missingPermsUser
					.toArray()
					.map((perm) => `\`${perm}\``)
					.join(', ')}`,
			);
			return;
		}

		if (missingPermsBot) {
			await ctx.error(
				`**Remoji** needs the following permissions to run this command:
        ${missingPermsBot
					.toArray()
					.map((perm) => `\`${perm}\``)
					.join(', ')}`,
			);
			return;
		}

		if (this.options.voterOnly && !(await ctx.isVoter())) {
			const url = environment.TOPGG_VOTE_URL;
			await ctx.error(`:lock: To unlock the \`/${this.data.name}\` command, [vote for Remoji on top.gg](${url})!`);
			return;
		}

		// TODO: check this.options.premiumOnly

		await this.run(ctx);
	}

	abstract run(ctx: CommandContext<GUILD>): Promise<void>;
}
