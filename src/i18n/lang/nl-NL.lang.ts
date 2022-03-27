/* eslint-disable @typescript-eslint/lines-between-class-members */
import { Nullable } from '@remoji-bot/core';
import { PermissionString } from 'discord.js';
import { Lang_en_US } from './en-US.lang';
import { I18NLanguage } from '..';

/**
 * Locale: nl-NL
 * Dutch (Nederlands)
 *
 * Translated by: cyarox
 */
export class Lang_nl_NL extends Lang_en_US {
	public override NAME_DEFAULT = 'Dutch';
	public override NAME_LOCAL = 'Nederlands';

	public override ping_success = (delay: number): string => `Pong! Vertraging: ${delay}ms`;

	public override image_download_error_with_reason = (reason: Error): string =>
		`Kon afbeelding niet downloaden: \`${reason.message}\``;
	public override image_invalid_name = 'Dat lijkt niet op een geldige naam...';
	public override image_invalid_url = 'Dat lijkt niet op een geldige URL...';
	public override image_invalid_domain =
		'Die afbeelding wordt niet gehost op een toegestane website. Probeer om het eerst naar imgur of Discord te uploaden!';
	public override image_unknown_error = 'Kon de afbeelding niet downloaden, een onbekende error heeft plaatsgevonden.';
	public override image_upload_success = (name: string, emoji: string): string =>
		`:tada:  Uploaded \`:${name}:\` naar je server! ${emoji}`;
	public override image_upload_failed_unknown_error =
		'Kon de emote niet uploaden. Een onbekende error heeft plaatsgevonden. Probeer een andere afbeelding, of probeer de afbeelding naar Discord opnieuw te uploaden.';
	public override language_change_success = (oldLocale: Nullable<I18NLanguage>, newLocale: I18NLanguage): string =>
		`Je taal is succesvol veranderd van \`${oldLocale ?? 'niks'}\` naar \`${newLocale}\``;

	public override embed_help_callout_title = 'Hulp nodig?';
	public override embed_remoji_author_name = 'Remoji - Discord emoji manager.';
	public override embed_footer_tagline = 'Remoji - Discord emoji manager - Gemaakt door Memikri';
	public override embed_join_support_server_link = 'Join de support server';
	public override embed_vote_callout_link = 'Klik hier om op Remoji te stemmen!';

	public override command_error_guild_only = ':x: Deze command kan alleen in jouw servers worden gebruikt.';
	public override command_error_user_missing_permission = (permissions: PermissionString[]): string =>
		`**Jij** hebt de volgende machtigingen nodig om deze command te kunnen gebruiken: ${permissions
			.map((perm) => `\`${perm}\``)
			.join(', ')}`;
	public override command_error_bot_missing_permission = (permissions: PermissionString[]): string =>
		`**Remoji** heeft de volgende machtigingen nodig om deze command te kunnen gebruiken: ${permissions
			.map((perm) => `\`${perm}\``)
			.join(', ')}`;
	public override command_error_vote_locked = (commandName: string, topggURL: string): string =>
		`:lock: Om \`/${commandName}\` te kunnen gebruiken, [stem voor Remoji op top.gg](${topggURL})!`;

	public override emote_copy_invalid_emote =
		'Kon geen emote vinden om te kopiëren. Zorg ervoor dat je een **aangepaste** emote gebruikt.';
	public override emote_copy_invalid_name =
		'Dat is geen valide emote naam. Emote namen moet tussen 2-32 tekens zijn en kan letters, nummers en onderstrepingstekens bevatten.';
	public override emote_copy_invalid_url = 'Kon deze emote niet downloaden. Misschien is het verwijdered?';
	public override emote_copy_invalid_domain =
		'Kan deze emote niet downloaden vanwege een invalide CDN domain naam. Meld alstublieft deze error bij de developers.';
	public override emote_copy_unknown_download_error =
		'Een onbekende error heeft plaatsgevonden tijdens het downloaden van die emote.';
	public override emote_copy_unknown_upload_error =
		'Een onbekende error heeft plaatsgevonde tijdens het uploaden van je emote naar Discord.';
	public override emote_copy_success = (name: string, newEmoji: string): string =>
		`:tada:  \`:${name}:\` is naar je server gekopieerd! ${newEmoji}`;
}
