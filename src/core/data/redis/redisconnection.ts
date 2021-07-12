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

import * as ioredis from "ioredis";
import environment from "../../../environment";

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

  readonly redis: ioredis.Redis;

  private constructor() {
    this.redis = new ioredis({
      host: environment.REDIS_HOST ?? "redis",
      port: environment.REDIS_PORT ?? 6379,
      showFriendlyErrorStack: true,
    });
  }
}
