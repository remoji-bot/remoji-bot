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

import * as discord from "discord.js";
import { Bot } from "../bot";
import { Logger } from "../logger";

/**
 * The basic abstract class for all commands.
 */
export abstract class Command {
  readonly data: Readonly<discord.ApplicationCommandData>;
  readonly bot = Bot.getInstance();

  constructor(data: discord.ApplicationCommandData) {
    Logger.verbose(`Constructed Command: ${data.name}`);
    this.data = data;
  }

  abstract run(interaction: discord.CommandInteraction): Promise<void | string>;
}
