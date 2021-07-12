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

import { RedisConnection } from "./RedisConnection";

/**
 * Represents a redis cache namespace.
 */
export class RedisCacheManager {
  readonly connection = RedisConnection.getInstance();
  readonly type: string;

  constructor(type: string) {
    this.type = type;
  }

  // SET cache:{type}:{key} {value}

  /**
   * Get the key name for a key in this cache namespace.
   *
   * @param key - The name of the key.
   * @returns - They namespaced key.
   */
  keyName(key: string): string {
    return `cache:${this.type}:${key}`;
  }

  /**
   * Get the value of a key from the cache.
   *
   * @param key - The key to fetch.
   * @returns - The value of the key.
   */
  async get(key: string): Promise<string | null> {
    return await this.connection.redis.get(this.keyName(key));
  }

  /**
   * Set a key in the cache.
   *
   * @param key - The key to set.
   * @param value - The value to set the key to.
   * @param expiryMilliseconds - After how many milliseconds the key should expire.
   */
  async set(key: string, value: string, expiryMilliseconds: number): Promise<void> {
    await this.connection.redis.set(this.keyName(key), value, "px", expiryMilliseconds);
  }
}
