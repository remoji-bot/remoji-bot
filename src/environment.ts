import assert from 'assert';
import { getenv } from '@remoji-bot/core';
import * as discord from 'discord.js';
import dotenv from 'dotenv-safe';
import { assert as assertType } from 'superstruct';

import * as structs from './core/utils/structs';

dotenv.config();

const environment = Object.freeze({
	NODE_ENV: getenv('NODE_ENV', false, true),

	API_PORT: getenv('API_PORT', true, true),
	API_HOST: getenv('API_HOST', false, true),
	API_TIMEOUT: getenv('API_TIMEOUT', true, true),

	REDIS_PORT: getenv('REDIS_PORT', true, false),
	REDIS_HOST: getenv('REDIS_HOST', false, false),

	DISCORD_TOKEN: getenv('DISCORD_TOKEN', false, true),
	DISCORD_APPLICATION_ID: getenv('DISCORD_APPLICATION_ID', false, true),
	TESTING_GUILD_ID: getenv('TESTING_GUILD_ID', false, false) as discord.Snowflake,
	DEVELOPER_ID: getenv('DEVELOPER_ID', false, false),

	TOPGG_TOKEN: getenv('TOPGG_TOKEN', false, true),
	TOPGG_VOTE_URL: getenv('TOPGG_VOTE_URL', false, true),

	SUPPORT_INVITE: getenv('SUPPORT_INVITE', false, true),
});

// Conditional assertions
if (environment.NODE_ENV === 'production') {
	assert(environment.REDIS_HOST, 'REDIS_HOST is required for production');
	assert(environment.REDIS_PORT, 'REDIS_PORT is required for production');

	assert(!environment.TESTING_GUILD_ID, 'TESTING_GUILD_ID should not be set for production');
	assert(!environment.DEVELOPER_ID, 'DEVELOPER_ID should not be set for production');
} else {
	assert(environment.TESTING_GUILD_ID, 'TESTING_GUILD_ID is required for development');
	assertType(environment.TESTING_GUILD_ID, structs.Snowflake());

	if (environment.DEVELOPER_ID) assertType(environment.DEVELOPER_ID, structs.SnowflakeList());
}

// Check against structs
assertType(environment.DISCORD_APPLICATION_ID, structs.Snowflake());
assertType(environment.SUPPORT_INVITE, structs.URL());
assertType(environment.TOPGG_VOTE_URL, structs.URL());

export default environment;
