import { RedisConnection } from './RedisConnection';

/**
 * Represents a redis cache namespace.
 */
export class RedisCacheManager {
	public readonly connection = RedisConnection.getInstance();
	public readonly type: string;

	public constructor(type: string) {
		this.type = type;
	}

	// SET cache:{type}:{key} {value}

	/**
	 * Get the key name for a key in this cache namespace.
	 *
	 * @param key - The name of the key.
	 * @returns - They namespaced key.
	 */
	public keyName(key: string): string {
		return `cache:${this.type}:${key}`;
	}

	/**
	 * Get the value of a key from the cache.
	 *
	 * @param key - The key to fetch.
	 * @returns - The value of the key.
	 */
	public get(key: string): Promise<string | null> {
		return this.connection.redis.get(this.keyName(key));
	}

	/**
	 * Set a key in the cache.
	 *
	 * @param key - The key to set.
	 * @param value - The value to set the key to.
	 * @param expiryMilliseconds - After how many milliseconds the key should expire.
	 */
	public async set(key: string, value: string, expiryMilliseconds: number): Promise<void> {
		await this.connection.redis.set(this.keyName(key), value, 'px', expiryMilliseconds);
	}
}
