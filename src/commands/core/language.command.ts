import { Command } from '../../core/base/Command';
import { CommandContext } from '../../core/base/CommandContext';
import { I18N, I18NLanguage } from '../../i18n/index';

/**
 * `/language` command - Set user language preference.
 */
export class LanguageCommand extends Command<false> {
	public constructor() {
		super(
			{
				name: 'language',
				description: 'Set preferred language for bot responses',
				options: [
					{
						name: 'language',
						description: 'The language to switch to (only affects bot messages)',
						type: 'STRING',
						required: true,
						choices: Object.keys(I18N.languages).map((languageId) => {
							const language = I18N.languages[languageId as I18NLanguage];
							const coverage = I18N.getLanguageCoverage(languageId as I18NLanguage);

							const coveragePercent = Math.floor(
								(coverage[0].length / (coverage[0].length + coverage[1].length)) * 100,
							);

							return {
								name: `${language.NAME_DEFAULT} (${language.NAME_LOCAL}) - ${coveragePercent}%`,
								value: languageId,
							};
						}),
					},
				],
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
		const language = ctx.interaction.options.getString('language');

		const oldI18N = await this.bot.i18nUserStore.get(ctx.interaction.user.id);

		const i18n = I18N.languages[language as I18NLanguage];
		await this.bot.i18nUserStore.set(ctx.interaction.user.id, language as I18NLanguage);

		await ctx.success(i18n.language_change_success(oldI18N, language as I18NLanguage));
	}
}
