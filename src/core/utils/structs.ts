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

import { pattern, string, Struct } from 'superstruct';
import * as discord from 'discord.js';

export const Snowflake = (): Struct<discord.Snowflake> =>
	pattern(string(), /^[1-9]\d{17,19}$/) as Struct<discord.Snowflake>;

export const SnowflakeList = (): Struct<string> =>
	pattern(string(), /^([1-9]\d{17,19},)*([1-9]\d{17,19})$/) as Struct<string>;

export const URL = (): Struct<string> =>
	pattern(string(), /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/) as Struct<string>;
