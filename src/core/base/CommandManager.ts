import { Logger, Nullable } from '@remoji-bot/core';
import { Collection } from 'discord.js';
import { Command } from './Command';

/**
 * A manager of commands.
 */
export class CommandManager {
	public readonly commands = new Collection<string, Command>();

	public readonly logger = Logger.getLogger('CommandManager');

	/**
	 * Get a command by name.
	 *
	 * @param name - The name of the command to get.
	 * @returns - The command.
	 */
	public get(name: string): Nullable<Command> {
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
	public register(command: Command): this {
		if (!this.commands.has(command.data.name)) this.commands.set(command.data.name, command);
		return this;
	}
}
