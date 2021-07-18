import { Logger } from '@remoji-bot/core';
import * as discord from 'discord.js';

import { CommandContext, GuildDependentInteraction } from './base/CommandContext';
import { CommandManager } from './base/CommandManager';
import { RedisConnection } from './data/redis/RedisConnection';
import { RedisStore } from './data/redis/RedisStore';
import { TopGGInterface } from './third-party/TopGGInterface';
import Constants from './utils/Constants';
import { API } from '../api/API';
import { LanguageCommand } from '../commands/core/language.command';
import { PingCommand } from '../commands/core/ping.command';
import { APICommand } from '../commands/dev/api.command';
import { I18NCovCommand } from '../commands/dev/i18ncov.command';
import { CopyCommand } from '../commands/emotes/copy.command';
import { InfoCommand } from '../commands/emotes/info.command';
import { UploadCommand } from '../commands/emotes/upload.command';
import environment from '../environment';
import { I18N, I18NLanguage } from '../i18n';

/**
 * The Bot singleton class.
 */
export class Bot {
	private static instance: Bot | null = null;

	/**
	 * Returns the singleton instance, creating one if needed.
	 *
	 * @returns the singleton instance
	 */
	public static getInstance(): Bot {
		if (!this.instance) this.instance = new this();
		return this.instance;
	}

	public readonly logger = Logger.getLogger('bot');

	public readonly client: discord.Client<true>;
	public readonly topgg = TopGGInterface.getInstance();
	public readonly commands = new CommandManager();
	public readonly api = API.getInstance();

	public readonly constants = Constants;

	public readonly i18nUserStore = new RedisStore<discord.Snowflake, I18NLanguage>('i18nUser');

	private constructor() {
		this.client = new discord.Client({
			allowedMentions: { parse: [] },
			intents: ['GUILDS', 'GUILD_EMOJIS'],
			shards: 'auto',
			rejectOnRateLimit: (data) => data.global,
		});

		this.client.on('interactionCreate', this.handleInteraction.bind(this));
	}

	/**
	 * Start the bot.
	 */
	public async connect(): Promise<void> {
		this.logger.info('Connecting to Redis...');
		await RedisConnection.getInstance().redis.ping();
		this.logger.info('Connecting to Discord...');
		await this.client.login(environment.DISCORD_TOKEN);
		this.logger.info(`Connected as ${this.client.user.tag} with ${this.client.shard?.count ?? 1} shard(s)`);
		await this.api.start();

		this.commands
			.register(new APICommand())
			.register(new I18NCovCommand())
			.register(new PingCommand())
			.register(new UploadCommand())
			.register(new LanguageCommand())
			.register(new CopyCommand())
			.register(new InfoCommand());

		const applicationCommands = await this.client.application.commands.fetch();

		// Remove all unregistered commands
		for (const [, command] of applicationCommands) {
			if (!this.commands.get(command.name)) {
				this.logger.verbose(`Unregistered command: ${command.name}`);
				await command.delete();
			}
		}

		if (environment.NODE_ENV === 'development') {
			this.logger.info('Removing production commands from testing bot');
			for (const [, command] of applicationCommands) {
				this.logger.verbose(`Remoing command: ${command.name}...`);
				await command.delete();
			}
			this.logger.info('Registering commands in testing guild...');
			await Promise.all(
				this.commands.commands.mapValues(async (command) => {
					const guild = await this.client.guilds.fetch(environment.TESTING_GUILD_ID as discord.Snowflake);
					await guild.commands.create(command.data);
				}),
			);
		} else {
			this.logger.info('Registering developer commands...');
			await Promise.all(
				this.commands.commands
					.filter((command) => Boolean(command.options.developerOnly))
					.mapValues(async (command) => {
						const guild = await this.client.guilds.fetch(environment.TESTING_GUILD_ID as discord.Snowflake);
						await guild.commands.create(command.data);
					}),
			);
			this.logger.info('Registering global commands...');
			await Promise.all(
				this.commands.commands
					.filter((command) => !command.options.developerOnly)
					.mapValues(async (command) => {
						await this.client.application.commands.create(command.data);
					}),
			);
		}

		this.logger.info('Registered commands!');

		// Fetch application info for isDeveloper checks
		await this.client.application.fetch();
	}

	/**
	 * Handle an interaction event.
	 *
	 * @param interaction - The interaction to handle.
	 */
	private async handleInteraction(interaction: discord.Interaction): Promise<void> {
		const i18n = await this.getI18N(interaction.user.id);
		if (interaction.isCommand()) {
			const command = this.commands.get(interaction.commandName);
			if (command) {
				this.logger.verbose(
					`User ${interaction.user.tag} (${interaction.user.id}) ran command: /${
						command.data.name
					} with options: ${JSON.stringify(interaction.options.toJSON())}, guild: ${
						interaction.guildId ?? 'N/A'
					}, channel: ${interaction.channelId}, interaction: ${interaction.id}`,
				);
				// eslint-disable-next-line @typescript-eslint/dot-notation
				await command['_run'](new CommandContext(this, interaction as GuildDependentInteraction<boolean>, i18n));
			} else {
				// Remove the command as it is not registered
				await interaction.command?.delete();
				await interaction.reply({ content: i18n.unknown_command(interaction.commandName), ephemeral: true });
			}
		} else if (interaction.isButton()) {
			// TODO : Handle buttons using button commands for interactions
		} else if (interaction.isSelectMenu()) {
			// TODO : Handle select menus using select menu commands for interactions
		}
	}

	/**
	 * Returns whether the given user is a bot developer.
	 *
	 * @param userId - The user ID to check.
	 * @returns Whether the given user is a bot developer.
	 */
	public isDeveloper(userId: discord.Snowflake): boolean {
		// Allow override in development environment
		if (environment.NODE_ENV === 'development' && environment.DEVELOPER_ID?.split(',').includes(userId)) return true;

		const owner = this.client.application.owner;

		if (owner instanceof discord.User) {
			return userId === owner.id;
		} else if (owner instanceof discord.Team) {
			return owner.members.has(userId);
		}

		throw new Error('Owner is not a User or Team');
	}

	/**
	 * Get an i18n object for a specific user.
	 *
	 * @param user - The user ID for which to fetch preferred language
	 * @returns The I18N object to use for translation
	 */
	public async getI18N(user?: discord.Snowflake): Promise<I18N> {
		const userLanguage = user && (await this.i18nUserStore.get(user));
		const i18n =
			userLanguage && userLanguage in I18N.languages
				? I18N.languages[userLanguage]
				: I18N.languages[I18N.defaultLanguage];
		return i18n;
	}
}
