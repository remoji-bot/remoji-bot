import { Command } from '../../core/base/Command';
import { CommandContext } from '../../core/base/CommandContext';
import { EmbedUtil } from '../../core/utils/EmbedUtil';
import environment from '../../environment';

/**
 * `/info` command - Get info about Remoji.
 */
export class InfoCommand extends Command<true> {
	public constructor() {
		super(
			{
				name: 'info',
				description: 'Get info about Remoji',
			},
			{
				guildOnly: true,
			},
		);
	}

	/**
	 * Run the command.
	 *
	 * @param ctx - The context for the command.
	 */
	public async run(ctx: CommandContext<true>): Promise<void> {
		const bot = ctx.bot;

		const infoEmbed = EmbedUtil.info(ctx.s, ctx.s.info_remoji_description)
			.setThumbnail(bot.client.user.displayAvatarURL()) // TODO: Fix this mess
			.addField(ctx.s.info_remoji_server_field, ctx.s.info_remoji_server_invite(environment.SUPPORT_INVITE))
			.addField(
				ctx.s.info_remoji_bot_field,
				ctx.s.info_remoji_bot_invite(environment.DISCORD_APPLICATION_ID, bot.constants.requiredPermissions.toString()),
			)
			.addField(ctx.s.info_remoji_vote_field, ctx.s.info_remoji_vote_value(environment.TOPGG_VOTE_URL))
			.addField(
				ctx.s.info_remoji_created,
				'[GitHub](https://github.com/shinotheshino)  |  [Patreon](https://patreon.com/shinotheshino)  |  [Twitch](https://twitch.tv/shinotheshino)',
			)
			.setFooter(ctx.s.info_remoji_version(bot.constants.version, bot.constants.git.branch, bot.constants.git.commit));
		await ctx.interaction.reply({ embeds: [infoEmbed] });
	}
}
