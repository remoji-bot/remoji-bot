import * as crypto from 'crypto';
import { Command } from '../../core/base/Command';
import { CommandContext } from '../../core/base/CommandContext';

/**
 * `/api` command - gets and revokes API keys.
 *
 * For developers only.
 */
export class APICommand extends Command<true> {
	public constructor() {
		super(
			{
				name: 'api',
				description: 'API commands',
				// defaultPermission: false,
				options: [
					{
						name: 'key',
						type: 'SUB_COMMAND_GROUP',
						description: 'Operations for API keys',
						options: [
							{
								name: 'get',
								type: 'SUB_COMMAND',
								description: 'Get an API key',
							},
							{
								name: 'revoke',
								type: 'SUB_COMMAND',
								description: 'Revoke an API key',
							},
						],
					},
				],
			},
			{
				guildOnly: true,
				developerOnly: true,
			},
		);
	}

	/**
	 * Run the command.
	 *
	 * @param ctx - The context for the command.
	 */
	public async run(ctx: CommandContext<true>): Promise<void> {
		const key = ctx.options.subcommand('key');

		if (key) {
			const get = key.subcommand('get');
			const revoke = key.subcommand('revoke');

			if (get) {
				let apiKey = await this.bot.api.authStore.get(ctx.interaction.user.id);
				if (!apiKey) {
					apiKey = crypto.randomBytes(32).toString('hex');
					await this.bot.api.authStore.set(ctx.interaction.user.id, apiKey);
					await this.bot.api.authStore.set(apiKey, ctx.interaction.user.id);
				}

				await ctx.base(`Your API key is: \`${apiKey}\``, true);
			} else if (revoke) {
				const key = await this.bot.api.authStore.get(ctx.interaction.user.id);
				if (key) {
					await this.bot.api.authStore.delete(ctx.interaction.user.id);
					await this.bot.api.authStore.delete(key);
					await ctx.base('Your API key has been revoked.', true);
				} else {
					await ctx.base("You don't have an API key.", true);
				}
			}
		}
	}
}
