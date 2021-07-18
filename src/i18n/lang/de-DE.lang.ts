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

import { PermissionString } from 'discord.js';
import { I18NLanguage } from '..';
import { Nullable } from '@remoji-bot/core';
import { Lang_en_US } from './en-US.lang';

/**
 * Locale: de-DE
 * German (Standard)
 *
 * Translated by: cyarox
 */
export class Lang_de_DE extends Lang_en_US {
	override NAME_DEFAULT = 'German';
	override NAME_LOCAL = 'Deutsch';

	override ping_success = (delay: number): string => `Pong! Latenz: ${delay}ms`;

	override image_download_error_with_reason = (reason: Error): string =>
		`Bild kann nicht heruntergeladen werden: \`${reason}\``;
	override image_invalid_name = 'Das sieht nicht nach einem gültigen Namen aus...';
	override image_invalid_url = 'Das sieht nicht nach einer gültigen URL aus...';
	override image_invalid_domain =
		'Dieses Bild wird nicht auf eine erlaubte Website gehostet. Versuche es zuerst auf imgur oder Discord hochzuladen!';
	override image_unknown_error =
		'Das Bild konnte nicht heruntergeladen werden, ein unbekannter Fehler ist aufgetreten.';
	override image_upload_success = (name: string, emoji: string): string =>
		`:tada:  \`:${name}:\` auf ihren Server hochgeladen! ${emoji}`;
	override image_upload_failed_unknown_error =
		'Könnte das Emote nicht hochladen. Ein unbekannter Fehler ist aufgetreten. Versuchen Sie es mit einem anderen Bild oder versuchen Sie erneut, das Bild auf Discord hochzuladen.';
	override language_change_success = (oldLocale: Nullable<I18NLanguage>, newLocale: I18NLanguage): string =>
		`Die Sprache wurde erfolgreich gewechselt zu \`${oldLocale ?? 'keiner'}\` zu \`${newLocale}\``;

	override embed_help_callout_title = 'brauchen Sie Hilfe?';
	override embed_remoji_author_name = 'Remoji - Discord emoji manager';
	override embed_footer_tagline = 'Remoji - Discord emoji manager - erstellt von Shino';
	override embed_join_support_server_link = 'Treten Sie dem Support-Server bei';
	override embed_vote_callout_link = 'Klicken Sie hier, um für Remoji abzustimmen!';

	override command_error_guild_only = ':x: This command can only be used in servers.';
	override command_error_user_missing_permission = (permissions: PermissionString[]): string =>
		`**You** need the following permissions to run this command: ${permissions
			.map((perm) => `\`${perm}\``)
			.join(', ')}`;
	override command_error_bot_missing_permission = (permissions: PermissionString[]): string =>
		`**Remoji** needs the following permissions to run this command: ${permissions
			.map((perm) => `\`${perm}\``)
			.join(', ')}`;
	override command_error_vote_locked = (commandName: string, topggURL: string): string =>
		`:lock: To unlock the \`/${commandName}\` command, [vote for Remoji on top.gg](${topggURL})!`;

	override emote_copy_invalid_emote = 'Could not find an emote to copy. Make sure you use a **custom** emote.';
	override emote_copy_invalid_name =
		"That isn't a valid emote name. Emote names must be between 2-32 characters and may contain letters, numbers, and underscores.";
	override emote_copy_invalid_url = 'Could not download that emote. Maybe it was deleted?';
	override emote_copy_invalid_domain =
		'Could not download that emote due to an invalid CDN domain name. Please report this error to the developers.';
	override emote_copy_unknown_download_error = 'An unknown error occurred while downloading that emote.';
	override emote_copy_unknown_upload_error = 'An unknown error occurred while uploading your emoji to Discord.';
	override emote_copy_success = (name: string, newEmoji: string): string =>
		`:tada:  Copied \`:${name}:\` to your server! ${newEmoji}`;
}
