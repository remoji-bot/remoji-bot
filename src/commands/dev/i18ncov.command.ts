import { MessageEmbed } from 'discord.js';
import { Command } from '../../core/base/Command';
import { CommandContext } from '../../core/base/CommandContext';
import { I18N, LANGUAGES } from '../../i18n';

/**
 * `/i18ncov` - Show coverage of i18n files
 */
export class I18NCovCommand extends Command<true> {
	public constructor() {
		super(
			{
				name: 'i18ncov',
				description: 'Show coverage of i18n strings',
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
	 * @param ctx - The context.
	 */
	public async run(ctx: CommandContext<true>): Promise<void> {
		const embed = new MessageEmbed().setTitle('I18N Coverage Report');
		let overallCovered = 0;
		let overallTotal = 0;

		for (const language of LANGUAGES) {
			const coverage = I18N.getLanguageCoverage(language);
			const coveragePercent = I18N.getLanguageCoveragePercent(language);
			const missing = coverage[1]
				.slice()
				.sort((a, b) => a.localeCompare(b))
				.map((key) => `\`${key}\``)
				.join(', ');
			embed.addField(
				`${language} ${Math.floor(coveragePercent * 100)}%`,
				missing.length ? `Missing (${coverage[1].length}): ${missing}` : '✅ Complete',
			);
			overallCovered += coverage[0].length;
			overallTotal += coverage[0].length + coverage[1].length;
		}
		embed.setFooter({
			text: `Overall: ${overallCovered}/${overallTotal} strings covered (${Math.floor((overallCovered / overallTotal) * 100)}%)`,
		});
		await ctx.interaction.reply({ embeds: [embed] });
	}
}
