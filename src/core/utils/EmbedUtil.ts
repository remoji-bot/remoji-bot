import { MessageEmbed } from 'discord.js';
import environment from '../../environment';
import { I18N } from '../../i18n';
import { Bot } from '../Bot';

/**
 *An embed builder.
 */
export class EmbedUtil extends null {
	/**
	 * Create a base embed.
	 *
	 * @param i18n - The `I18N` instance to use
	 * @returns - The created base embed.
	 */
	public static base(i18n: I18N): MessageEmbed {
		return new MessageEmbed()
			.setColor(0xfffffe)
			.setAuthor(
				i18n.embed_remoji_author_name,
				Bot.getInstance().client.user.displayAvatarURL(),
				environment.TOPGG_VOTE_URL,
			);
	}

	/**
	 * Create an error embed.
	 *
	 * @param i18n - The `I18N` instance to use
	 * @param description - The description of the error embed.
	 * @returns - The created error embed.
	 */
	public static error(i18n: I18N, description: string): MessageEmbed {
		return this.base(i18n)
			.setColor(0xff5555)
			.setDescription(description)
			.addField(
				i18n.embed_help_callout_title,
				`[${i18n.embed_join_support_server_link}](${environment.SUPPORT_INVITE})`,
			);
	}

	/**
	 * Create a success embed.
	 *
	 * @param i18n - The `I18N` instance to use
	 * @param description - The description of the success embed.
	 * @returns - The created success embed.
	 */
	public static success(i18n: I18N, description: string): MessageEmbed {
		return this.base(i18n)
			.setColor(0x55ff55)
			.setAuthor(
				i18n.embed_vote_callout_link,
				'https://i.imgur.com/1wLOFn2.png', // Star
				environment.TOPGG_VOTE_URL,
			)
			.setDescription(description)
			.setFooter(i18n.embed_footer_tagline);
	}

	/**
	 * Creates a success-followup embed.
	 *
	 * @param i18n - The `I18N` instance to use
	 * @param description - The description of the success-followup embed.
	 * @returns - The created success-followup embed.
	 */
	public static successFollowup(_i18n: I18N, description: string): MessageEmbed {
		return new MessageEmbed().setColor(0x55ff55).setDescription(description);
	}

	/**
	 * Create an info embed.
	 *
	 * @param i18n - The `I18N` instance to use
	 * @param description - The description of the info embed.
	 * @returns - The created info embed.
	 */
	public static info(i18n: I18N, description: string): MessageEmbed {
		return this.base(i18n).setColor(0x5555ff).setDescription(description);
	}
}
