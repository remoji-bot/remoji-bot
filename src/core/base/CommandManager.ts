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

import { Collection } from 'discord.js';
import { Logger, Nullable } from '@remoji-bot/core';
import { Command } from './Command';

/**
 * A manager of commands.
 */
export class CommandManager {
	readonly commands = new Collection<string, Command>();

	readonly logger = Logger.getLogger('CommandManager');

	/**
	 * Get a command by name.
	 *
	 * @param name - The name of the command to get.
	 * @returns - The command.
	 */
	get(name: string): Nullable<Command> {
		const command = this.commands.get(name);
		if (command) return command;
		this.logger.warn(`Could not find command: ${name}`);
		return null;
	}

	/**
	 * Register a 🆕 command.
	 *
	 * @param command - The command to register.
	 * @returns - The class, for chaining, but only if you want to, :chains: :flushed:
	 * @see https://www.amazon.com/dp/B00TJYYKD6
	 */
	register(command: Command): this {
		if (!this.commands.has(command.data.name)) this.commands.set(command.data.name, command);
		return this;
	}
}
