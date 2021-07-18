import { Logger, Nullable } from '@remoji-bot/core';
import * as topgg from '@top-gg/sdk';
import { Snowflake } from 'discord.js';

import environment from '../../environment';
import { RedisCacheManager } from '../data/redis/RedisCacheManager';

/**
 * A high level caching interface to the topgg API.
 */
export class TopGGInterface {
	private static instance?: TopGGInterface;

	/**
	 * Gets the singleton instance, creating one if it does not exist.
	 *
	 * @returns The singleton instance.
	 */
	public static getInstance(): TopGGInterface {
		if (!this.instance) this.instance = new this();
		return this.instance;
	}

	public readonly logger = Logger.getLogger('topgg');

	public readonly apiKey = environment.TOPGG_TOKEN;
	public readonly api: Nullable<topgg.Api>;
	public readonly cache = new RedisCacheManager('topgg');

	private constructor() {
		this.api = this.apiKey ? new topgg.Api(this.apiKey) : null;
	}

	/**
	 * Check if a user has voted for the bot.
	 *
	 * @param user - The user ID to check.
	 * @returns - Whether the user has voted.
	 */
	public async hasVoted(user: Snowflake): Promise<boolean> {
		const result = await this._hasVoted(user);
		return result;
	}

	/**
	 * Check if a user has voted for the bot.
	 *
	 * @param user - The user ID to check.
	 * @returns - Whether the user has voted.
	 */
	private async _hasVoted(user: Snowflake): Promise<boolean> {
		if (!this.api || process.env.NODE_ENV === 'development') return true;

		const cached = await this.cache.get(user);
		if (cached) return true;

		const result = await this.api.hasVoted(user);

		if (result) {
			await this.cache.set(user, 'h', 60 * 60 * 1000);
			return true;
		}

		return false;
	}
}
