import { time } from '@remoji-bot/core';
import { Command } from '../../core/base/Command';
import { CommandContext } from '../../core/base/CommandContext';
import { EmbedUtil } from '../../core/utils/EmbedUtil';

/**
 * `/ping` command - Tests the bot's connection to Discord.
 */
export class PingCommand extends Command<false> {
	public constructor() {
		super(
			{
				name: 'ping',
				description: "Test the bot's connection to Discord",
			},
			{
				guildOnly: false,
			},
		);
	}

	/**
	 * Run the command.
	 *
	 * @param ctx - The context for the command.
	 */
	public async run(ctx: CommandContext<false>): Promise<void> {
		const [delay] = await time(() => ctx.interaction.deferReply());
		await ctx.interaction.editReply({
			embeds: [EmbedUtil.success(ctx.i18n, ctx.s.ping_success(Math.floor(delay)))],
		});
	}
}
