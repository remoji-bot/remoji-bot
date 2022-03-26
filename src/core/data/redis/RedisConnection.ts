import Redis from 'ioredis';
import environment from '../../../environment';

/**
 * Represents a connection to Redis.
 */
export class RedisConnection {
	private static instance?: RedisConnection;

	/**
	 * Gets the singleton instance, creating one if it does not exist.
	 *
	 * @returns - the singleton instance
	 */
	public static getInstance(): RedisConnection {
		if (!this.instance) this.instance = new this();
		return this.instance;
	}

	public readonly redis: Redis;

	private constructor() {
		this.redis = new Redis({
			host: environment.REDIS_HOST ?? 'redis',
			port: environment.REDIS_PORT ?? 6379,
			showFriendlyErrorStack: true,
		});
	}
}
