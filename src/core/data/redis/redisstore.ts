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

import { Nullable } from "../../utils/types";
import { RedisConnection } from "./redisconnection";

/**
 * Represents a redis store namespace.
 */
export class RedisStore<K extends string = string, V extends string = string> {
  readonly connection = RedisConnection.getInstance();
  readonly identifier: string;

  constructor(identifier: string) {
    this.identifier = identifier;
  }

  /**
   * The key.
   *
   * @returns the key
   */
  get keyName(): string {
    return `store:${this.identifier}`;
  }

  /**
   * Get the value of a key from the store.
   *
   * @param key - The key to fetch.
   * @returns - The value of the key.
   */
  async get(key: K): Promise<Nullable<V>> {
    return (await this.connection.redis.hget(this.keyName, key)) as Nullable<V>;
  }

  /**
   * Set a key in the store.
   *
   * @param key - The key to set.
   * @param value - The value to set the key to.
   */
  async set(key: K, value: V): Promise<void> {
    await this.connection.redis.hset(this.keyName, key, value);
  }

  /**
   * Delete a key from the store.
   *
   * @param key - The key to delete.
   */
  async delete(key: K): Promise<void> {
    await this.connection.redis.hdel(this.keyName, key);
  }

  /**
   * Check if a key exists in the store.
   *
   * @param key - The key to check for.
   * @returns - Whether the key was found in the store.
   */
  async has(key: K): Promise<boolean> {
    return (await this.connection.redis.hexists(this.keyName, key)) > 0;
  }
}
