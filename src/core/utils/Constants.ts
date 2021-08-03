import { execSync } from 'child_process';
import { Permissions } from 'discord.js';

const Constants = Object.freeze({
	requiredPermissions: Permissions.resolve([
		'MANAGE_EMOJIS_AND_STICKERS',
		'VIEW_CHANNEL',
		'READ_MESSAGE_HISTORY',
		'USE_EXTERNAL_EMOJIS',
	]),
	version: '2.2.0',
	git: Object.freeze({
		branch: execSync('git rev-parse --abbrev-ref HEAD').toString('utf8').trim(),
		commit: execSync('git rev-parse --short HEAD').toString('utf8').trim(),
	}),
});

export default Constants;
