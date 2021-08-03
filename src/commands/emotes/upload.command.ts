import { Command } from '../../core/base/Command';
import { CommandContext } from '../../core/base/CommandContext';
import { ImageUtil } from '../../core/utils/ImageUtil';

/**
 * `/upload` command - Upload an emote by its link.
 */
export class UploadCommand extends Command<true> {
	public constructor() {
		super(
			{
				name: 'upload',
				description: 'Upload an emote by its link',
				options: [
					{
						name: 'url',
						type: 'STRING',
						description: 'The link to the emote or image',
						required: true,
					},
					{
						name: 'name',
						type: 'STRING',
						description: 'The name of the new emote to create',
						required: true,
					},
				],
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
	 * @returns - void
	 */
	public async run(ctx: CommandContext<true>): Promise<void> {
		const url = ctx.interaction.options.getString('url', true);
		const name = ctx.interaction.options.getString('name', true);

		if (name.length < 3 || !/^[\w_]+$/.test(name)) return ctx.error(ctx.s.image_invalid_name);

		const image = await ImageUtil.downloadImage(url);

		if (!image.success) {
			if (image.error) await ctx.error(ctx.s.image_download_error_with_reason(image.error));
			else if (!image.validURL) await ctx.error(ctx.s.image_invalid_url);
			// eslint-disable-next-line no-negated-condition
			else if (!image.whitelistedURL) await ctx.error(ctx.s.image_invalid_domain);
			else await ctx.error(ctx.s.image_unknown_error);
			return;
		}

		// TODO: check remaining emote slots/animated status

		try {
			const emoji = await ctx.interaction.guild.emojis.create(Buffer.from(image.data), name, {
				reason: `Uploaded by ${ctx.interaction.user.tag} (${ctx.interaction.user.id}) using /${this.data.name}`,
			});
			await ctx.success(ctx.s.image_upload_success(name, emoji.toString()));
		} catch (error) {
			this.logger.error(error);
			await ctx.error(ctx.s.image_upload_failed_unknown_error);
		}
	}
}
