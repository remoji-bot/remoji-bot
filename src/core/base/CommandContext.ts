import { inspect } from 'util';
import { Ternary } from '@remoji-bot/core';
import { APIInteractionGuildMember } from 'discord-api-types';
import {
	CommandInteraction,
	DMChannel,
	Guild,
	GuildMember,
	NewsChannel,
	PartialDMChannel,
	Snowflake,
	TextChannel,
	ThreadChannel,
} from 'discord.js';
import { I18N } from '../../i18n';
import { Bot } from '../Bot';
import { EmbedUtil } from '../utils/EmbedUtil';

/**
 * Typing utility for guild interactions.
 */
export type GuildDependentInteraction<GUILD extends boolean> = CommandInteraction &
	Ternary<
		GUILD,
		{
			guild: Guild;
			guildID: Snowflake;
			member: GuildMember | APIInteractionGuildMember;
			channel: TextChannel | NewsChannel | ThreadChannel;
		},
		{
			guild: null;
			guildID: null;
			member: null;
			channel: DMChannel | PartialDMChannel;
		}
	>;

/**
 * Wraps a Slash Command interaction, providing useful methods and utilities.
 */
export class CommandContext<GUILD extends boolean = boolean> {
	public readonly interaction: GuildDependentInteraction<GUILD>;

	/**
	 * Alias for `i18n`
	 *
	 * @returns the `I18N` instance.
	 */
	public get s(): I18N {
		return this.i18n;
	}

	public constructor(
		public readonly bot: Bot,
		interaction: GuildDependentInteraction<GUILD>,
		public readonly i18n: I18N,
	) {
		this.interaction = interaction;
	}

	public getSubCommandIdentifier(): string | null {
		const group = this.interaction.options.getSubcommandGroup(false);
		const subCommand = this.interaction.options.getSubcommandGroup(false);
		if (!subCommand) {
			return null;
		}
		if (group) {
			return `${group}:${subCommand}`;
		}
		return subCommand;
	}

	/**
	 * Checks if the context is from a guild interaction.
	 *
	 * @returns whether this is a guild interaction
	 */
	public isGuild(): this is CommandContext<true> {
		return this.interaction.guild !== null;
	}

	/**
	 * Returns whether the interaction user has voted on top.gg.
	 *
	 * @returns whether the interaction user has voted
	 */
	public isVoter(): Promise<boolean> {
		const bot = Bot.getInstance();
		return bot.topgg.hasVoted(this.interaction.user.id);
	}

	/**
	 * Returns whether the interaction user is a bot developer.
	 *
	 * @returns whether the interaction user is a bot developer.
	 */
	public isDeveloper(): boolean {
		return this.bot.isDeveloper(this.interaction.user.id);
	}

	/**
	 * Sends a plain text reply.
	 *
	 * @param message - The content of the message
	 * @param ephemeral - Whether to send an ephemeral message
	 */
	public async send(message: string, ephemeral = false): Promise<void> {
		await this.interaction.reply({ content: message, ephemeral });
	}

	/**
	 * Sends a base embed.
	 *
	 * @param message - The content of the embed
	 * @param ephemeral - Whether to send an ephemeral message
	 */
	public async base(message: string, ephemeral = false): Promise<void> {
		await this.interaction.reply({ embeds: [EmbedUtil.base(this.i18n).setDescription(message)], ephemeral });
	}

	/**
	 * Sends an error embed using `EmbedBuilder`.
	 *
	 * @param message - The content of the error message
	 * @param ephemeral - Whether to send an ephemeral message
	 */
	public async error(message: string, ephemeral = false): Promise<void> {
		await this.interaction.reply({ embeds: [EmbedUtil.error(this.i18n, message)], ephemeral });
	}

	/**
	 * Sends a success embed using `EmbedBuilder`.
	 *
	 * @param message - The content of the success message
	 * @param ephemeral - Whether to send an ephemeral message
	 */
	public async success(message: string, ephemeral = false): Promise<void> {
		await this.interaction.reply({ embeds: [EmbedUtil.success(this.i18n, message)], ephemeral });
	}

	/**
	 * FOR TESTING ONLY - Sends a debug reply.
	 *
	 * @deprecated
	 * @param value - The value to send
	 */
	public async debug(value: unknown): Promise<void> {
		await this.interaction.reply({
			embeds: [EmbedUtil.base(this.i18n).setDescription(`\`\`\`js\n${inspect(value).slice(0, 4000)}\n\`\`\``)],
		});
	}
}
