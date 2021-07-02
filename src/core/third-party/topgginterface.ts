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

import * as topgg from "@top-gg/sdk";
import { Snowflake } from "discord.js";

import { RedisCacheManager } from "../data/redis/rediscachemanager";
import { Logger } from "../logger";
import { getenv } from "../utils/functions";
import { Nullable } from "../utils/types";

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
  readonly apiKey = getenv("TOPGG_API_KEY");
  readonly api: Nullable<topgg.Api>;
  readonly cache = new RedisCacheManager("topgg");

  private constructor() {
    this.api = this.apiKey ? new topgg.Api(this.apiKey) : null;
  }

  /**
   * Check if a user has voted for the bot.
   *
   * @param user - The user ID to check.
   * @returns - Whether the user has voted.
   */
  async hasVoted(user: Snowflake): Promise<boolean> {
    const result = await this._hasVoted(user);
    Logger.info(`hasVoted(${user}): ${result}`);
    return result;
  }

  /**
   * Check if a user has voted for the bot.
   *
   * @param user - The user ID to check.
   * @returns - Whether the user has voted.
   */
  private async _hasVoted(user: Snowflake): Promise<boolean> {
    if (!this.api || process.env.NODE_ENV === "development") return true;

    const cached = await this.cache.get(user);
    if (cached) return true;

    const result = await this.api.hasVoted(user);

    if (result) {
      await this.cache.set(user, "h", 60 * 60 * 1000);
      return true;
    }

    return false;
  }
}
