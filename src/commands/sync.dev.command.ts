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

import { SlashCommand, SlashCreator, CommandContext, CommandOptionType } from "slash-create";

class SyncCommand extends SlashCommand {
  constructor(creator: SlashCreator) {
    super(creator, {
      name: "sync",
      description: "[DEV] Triggers a full sync of application commands with Discord",
      options: [
        {
          name: "confirm",
          description: "A full sync can take a long time. Are you sure?",
          type: CommandOptionType.BOOLEAN,
          required: true,
        },
      ],
      guildIDs: process.env.COMMAND_TESTING_GUILD, // Keep this
    });
    this.filePath = __filename;
  }

  async run(ctx: CommandContext): Promise<void> {
    if (!ctx.guildID || ctx.guildID !== process.env.COMMAND_TESTING_GUILD) {
      await ctx.send("Nothing to see here.", { ephemeral: true });
      return;
    }

    if (!ctx.options.confirm) {
      await ctx.send("Never mind, then...", { ephemeral: true });
      return;
    }

    await this.creator.syncGlobalCommands();
    await this.creator.syncCommandsIn(process.env.COMMAND_TESTING_GUILD as string);

    await ctx.send(":white_check_mark: Command sync requested.");
  }
}

export = SyncCommand;
