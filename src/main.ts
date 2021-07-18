import { Logger } from '@remoji-bot/core';

import { Bot } from './core/Bot';
import environment from './environment';
import { I18N } from './i18n/index';

const logger = Logger.getDefault();

process.on('uncaughtException', (error) => {
	logger.error(error);
	if (environment.NODE_ENV === 'development') process.exit(1);
});

process.on('unhandledRejection', (rejection) => {
	logger.error(rejection);
	if (environment.NODE_ENV === 'development') process.exit(1);
});

process.on('SIGINT', () => {
	logger.info('Exiting...');
	process.exit(0);
});

/**
 * Async entrypoint.
 */
async function main() {
	await I18N.init();
	await Bot.getInstance().connect();
}

void main();
