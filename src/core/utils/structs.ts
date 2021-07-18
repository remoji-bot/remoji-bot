import * as discord from 'discord.js';
import { pattern, string, Struct } from 'superstruct';

export const Snowflake = (): Struct<discord.Snowflake> =>
	pattern(string(), /^[1-9]\d{17,19}$/) as Struct<discord.Snowflake>;

export const SnowflakeList = (): Struct<string> =>
	pattern(string(), /^([1-9]\d{17,19},)*([1-9]\d{17,19})$/) as Struct<string>;

export const URL = (): Struct<string> =>
	pattern(string(), /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/) as Struct<string>;
