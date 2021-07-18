import { Nullable } from '@remoji-bot/core';
import { RedisConnection } from './RedisConnection';

/**
 * Represents a redis store namespace.
 */
export class RedisStore<K extends string = string, V extends string = string> {
	public readonly connection = RedisConnection.getInstance();
	public readonly identifier: string;

	public constructor(identifier: string) {
		this.identifier = identifier;
	}

	/**
	 * The key.
	 *
	 * @returns the key
	 */
	public get keyName(): string {
		return `store:${this.identifier}`;
	}

	/**
	 * Get the value of a key from the store.
	 *
	 * @param key - The key to fetch.
	 * @returns - The value of the key.
	 */
	public async get(key: K): Promise<Nullable<V>> {
		return (await this.connection.redis.hget(this.keyName, key)) as Nullable<V>;
	}

	/**
	 * Set a key in the store.
	 *
	 * @param key - The key to set.
	 * @param value - The value to set the key to.
	 */
	public async set(key: K, value: V): Promise<void> {
		await this.connection.redis.hset(this.keyName, key, value);
	}

	/**
	 * Delete a key from the store.
	 *
	 * @param key - The key to delete.
	 */
	public async delete(key: K): Promise<void> {
		await this.connection.redis.hdel(this.keyName, key);
	}

	/**
	 * Check if a key exists in the store.
	 *
	 * @param key - The key to check for.
	 * @returns - Whether the key was found in the store.
	 */
	public async has(key: K): Promise<boolean> {
		return (await this.connection.redis.hexists(this.keyName, key)) > 0;
	}
}
