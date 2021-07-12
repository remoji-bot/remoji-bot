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
import { I18NLanguage } from "../../i18n";

/**
 * `/language` command - Set user language preference.
 */
export class LanguageCommand extends Command<false> {
  constructor() {
    super(
      {
        name: "language",
        description: "Set preferred language for bot responses",
        options: [
          {
            name: "language",
            description: "The language to switch to (only affects bot messages)",
            type: "STRING",
            required: true,
            choices: [
              { name: "US English (default)", value: "en-US" },
              { name: "Welsh", value: "cy-GB" },
              { name: "Dutch", value: "nl-NL" },
              { name: "German", value: "de-DE" },
            ],
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
  async run(ctx: CommandContext<false>): Promise<void> {
    const language = ctx.options.string("language") as I18NLanguage;

    const oldI18N = await this.bot.i18nUserStore.get(ctx.interaction.user.id);

    const i18n = this.bot.i18n[language];
    await this.bot.i18nUserStore.set(ctx.interaction.user.id, language);

    await ctx.success(i18n.language_change_success(oldI18N, language));
  }
}
