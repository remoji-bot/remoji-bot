import { Command } from '../../core/base/Command';
import { CommandContext } from '../../core/base/CommandContext';
import { ImageUtil } from '../../core/utils/ImageUtil';
import environment from '../../environment';

/**
 * `/copy` command - Copy one or more emotes to your server.
 */
export class CopyCommand extends Command<true> {
	public constructor() {
		super(
			{
				name: 'copy',
				description: 'Copy one or more emotes to your server',
				options: [
					{
						name: 'single',
						type: 'SUB_COMMAND',
						description: 'Copy a single emote',
						options: [
							{
								name: 'emote',
								type: 'STRING',
								description: 'The emote to copy',
								required: true,
							},
							{
								name: 'name',
								type: 'STRING',
								description: 'The new name for the emote',
								required: false,
							},
						],
					},
					{
						name: 'multiple',
						type: 'SUB_COMMAND',
						description: 'Copy multiple emotes at once',
						options: [
							{
								name: 'emotes',
								type: 'STRING',
								description: 'The emotes to copy (up to 30!)',
								required: true,
							},
						],
					},
				],
			},
			{
				guildOnly: true,
				userPermissions: ['MANAGE_EMOJIS_AND_STICKERS'],
				botPermissions: ['MANAGE_EMOJIS_AND_STICKERS'],
			},
		);
	}

	/**
	 * Run the command.
	 *
	 * @param ctx - The context for the command.
	 */
	public async run(ctx: CommandContext<true>): Promise<void> {
		// TODO: check remaining emote slots/animated status

		switch (ctx.interaction.options.getSubcommand(true)) {
			case 'multiple': {
				if (!(await ctx.isVoter())) {
					await ctx.error(ctx.s.command_error_vote_locked('copy multiple', environment.TOPGG_VOTE_URL));
					return;
				}

				const emotes = ImageUtil.extractEmojis(ctx.interaction.options.getString('emotes', true));
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (!emotes) {
					await ctx.error(ctx.s.emote_copy_no_emotes);
					return;
				}

				let failed = 0;

				for (const emote of emotes) {
					const image = await ImageUtil.downloadImage(emote.url);

					if (!image.success) {
						failed++;
						continue;
					}

					try {
						await ctx.interaction.guild.emojis.create(Buffer.from(image.data), emote.name);
					} catch (error) {
						this.logger.error(error);
						await ctx.error(ctx.s.emote_copy_unknown_upload_error);
						return;
					}
				}

				await ctx.success(ctx.s.emote_copy_multiple_success(failed, emotes.length - failed));

				// TODO: Copying progress
				// TODO: Graceful error handling
				// TODO: Handle Discord upload ratelimit
				break;
			}
			case 'single': {
				// Upload single emote
				const emote = ImageUtil.extractEmojis(ctx.interaction.options.getString('emote', true))[0];
				const name = ctx.interaction.options.getString('name', false);

				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				if (!emote) {
					await ctx.error(ctx.s.emote_copy_invalid_emote);
					return;
				}

				if (name && !/^[a-z0-9_]{2,32}$/i.test(name)) {
					await ctx.error(ctx.s.emote_copy_invalid_name);
					return;
				}

				const image = await ImageUtil.downloadImage(emote.url);

				if (!image.success) {
					if (image.error) await ctx.error(ctx.s.image_download_error_with_reason(image.error));
					else if (!image.validURL) await ctx.error(ctx.s.emote_copy_invalid_url);
					// eslint-disable-next-line no-negated-condition
					else if (!image.whitelistedURL) await ctx.error(ctx.s.emote_copy_invalid_domain);
					else await ctx.error(ctx.s.emote_copy_unknown_download_error);
					return;
				}

				try {
					const newEmoji = await ctx.interaction.guild.emojis.create(Buffer.from(image.data), name ?? emote.name);
					await ctx.success(ctx.s.emote_copy_success(name ?? emote.name, newEmoji.toString()));
				} catch (error) {
					this.logger.error(error);
					await ctx.error(ctx.s.emote_copy_unknown_upload_error);
				}
				break;
			}
		}
	}
}
