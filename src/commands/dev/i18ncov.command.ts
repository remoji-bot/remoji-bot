/*
  Remoji - Discord emoji manager bot
  Copyright (C) 2021 Shino <shinotheshino@gmail.com>.

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published
  by the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { Command } from "../../core/base/Command";
import { CommandContext } from "../../core/base/CommandContext";
import { I18N, LANGUAGES } from "../../i18n";
import { MessageEmbed } from "discord.js";

/**
 * `/i18ncov` - Show coverage of i18n files
 */
export class I18NCovCommand extends Command<true> {
  constructor() {
    super(
      {
        name: "i18ncov",
        description: "Show coverage of i18n strings",
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
  async run(ctx: CommandContext<true>): Promise<void> {
    const embed = new MessageEmbed().setTitle("I18N Coverage Report");
    for (const language of LANGUAGES) {
      const coverage = I18N.getLanguageCoverage(language);
      const coveragePercent = I18N.getLanguageCoveragePercent(language);
      const missing = coverage[1]
        .slice()
        .sort()
        .map(key => `\`${key}\``)
        .join(", ");
      embed.addField(
        `${language} ${Math.floor(coveragePercent * 100)}%`,
        missing.length ? `Missing (${coverage[1].length}): ${missing}` : "✅ Complete",
      );
    }
    await ctx.interaction.reply({ embeds: [embed] });
  }
}
