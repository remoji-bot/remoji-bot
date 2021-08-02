/* eslint-disable @typescript-eslint/lines-between-class-members */

import { Nullable } from '@remoji-bot/core';
import { PermissionString } from 'discord.js';
import { I18N, I18NLanguage } from '..';

/**
 * Locale: pl-PL
 * Polish
 *
 * Translated by: tipakA
 */
export class Lang_pl_PL extends I18N {
	public NAME_DEFAULT = 'Polish';
	public NAME_LOCAL = 'Polski';

	public override unknown_command = (): string => 'Nieznana komenda!';

	public override ping_success = (delay: number): string => `Pong! Opóźnienie: ${delay}ms`;

	// TODO: image
	public override image_download_error_with_reason = (reason: Error): string =>
		`Nie udało się pobrać obrazu: \`${reason.message}\``;
	// TODO: usage? this name doesn't look valid / this doens't look like valid name
	public override image_invalid_name = 'Ta nazwa nie wygląda na poprawną...';
	// TODO: same as above
	public override image_invalid_url = 'Ten adres URL nie wygląda na poprawny...';
	public override image_invalid_domain =
		'Ten obraz nie jest umieszczony na dozwolonej stronie. Spróbuj użyć imgur.com albo wyślij jako załącznik na Discordzie!';
	public override image_unknown_error = 'Nie udało się pobrać obrazu z powodu nieznanego błędu.';
	public override image_upload_success = (name: string, emoji: string): string =>
		`:tada:  Przesłano \`:${name}:\` na Twój serwer! ${emoji}`;
	public override image_upload_failed_unknown_error =
		'Nie udało się przesłać emoji z powodu nieznanego błędu. Spróbuj użyć innego obrazu lub wysłać obraz jako załącznik na Discordzie.';
	public override language_change_success = (oldLocale: Nullable<I18NLanguage>, newLocale: I18NLanguage): string =>
		`Pomyślnie zmieniono język${oldLocale ? ` z \`${oldLocale}` : ''} na \`${newLocale}\``;

	public override embed_help_callout_title = 'Potrzebujesz pomocy?';
	// TODO: branding?
	public override embed_remoji_author_name = 'Remoji - Discord emoji manager';
	public override embed_footer_tagline = 'Remoji - Discord emoji manager - Stworzony przez Shino';
	public override embed_join_support_server_link = 'Dołącz do serwera';
	public override embed_vote_callout_link = 'Kliknij tutaj aby głosować na Remoji!';

	// TODO: guild only or maybe not in DMs?
	public override command_error_guild_only = ':x: Ta komenda może być użyta jedynie na serwerach.';
	public override command_error_user_missing_permission = (permissions: PermissionString[]): string =>
		`Aby użyć tej komendy, potrzebujesz tych uprawnień: ${permissions.map((perm) => `\`${perm}\``).join(', ')}`;
	public override command_error_bot_missing_permission = (permissions: PermissionString[]): string =>
		`Aby użyć tej komendy, Remoji potrzebuje tych uprawnień: ${permissions.map((perm) => `\`${perm}\``).join(', ')}`;
	// TODO: unlock? use?
	public override command_error_vote_locked = (commandName: string, topggURL: string): string =>
		`:lock: aby odblokować komendę \`/${commandName}\`, [zagłosuj na Remoji na top.gg](${topggURL})!`;

	public override emote_copy_invalid_emote =
		'Nie znaleziono emoji do skopiowania. Można kopiować tylko **niestandardowe** emoji.';
	// TODO: emoji? emote?
	public override emote_copy_invalid_name =
		'To nie jest poprawna nazwa dla emoji. Nazwa musi mieć od 2 do 32 znaków oraz składać się tylko z liter, cyfr lub znaków podkreślenia';
	// TODO: ?
	public override emote_copy_invalid_url = 'Nie udało się pobrać emoji. Czy na pewno nie została usunięta?';
	public override emote_copy_invalid_domain =
		'Nie udało się pobrać emoji z powodu niepoprawnego adresu CDN. Prosimy o zgłoszenie tego błędu deweloperom.';
	public override emote_copy_unknown_download_error = 'Podczas pobierania emoji wystąpił nieznany błąd.';
	public override emote_copy_unknown_upload_error = 'Podczas przesyłania emoji na serwer wystąpił nieznany błąd.';
	public override emote_copy_success = (name: string, newEmoji: string): string =>
		`:tada:  Skopiowano \`:${name}:\` na Twój serwer! ${newEmoji}`;
	public override emote_copy_no_emotes = 'Musisz podać przyynajmniej 1 emoji do skopiowania.';
	public override emote_copy_multiple_success = (failed: number, success: number): string =>
		`Pomyślnie przesłano ${success} emoji! (Niepomyślne: ${failed})`;

	// TODO: ????
	// TODO: Uh, you do know that managing emoji is done in discord anyway, and that since 8.45g from march 2019 android has ways to manage emotes as well, right?
	public override info_remoji_description =
		'Remoji to bardzo prosty lecz bardzo skuteczny (?) bot do zarządzania emoji na Discordzie. Potrafi między innymi ~~kraść~~ *kopiować* lub przesyłać emoji na Twój serwer bezpośrednio w Discordzie, nawet będąc na telefonie!';
	public override info_remoji_server_field = 'Dołącz do serwera Remoji aby być na bieżąco z nowymi funkcjami!';
	public override info_remoji_server_invite = (invite: string): string => `**[DOŁĄCZ DO SERWERA REMOJI](${invite})**`;
	public override info_remoji_bot_field = 'Dodaj Remoji!';
	// TODO: Zaproszenie sounds bad, maybe address or like "click (here)"
	public override info_remoji_bot_invite = (appId: string, permissionBits: string): string =>
		`**[ADRES](https://discord.com/oauth2/authorize?client_id=${appId}&permissions=${permissionBits}&scope=applications.commands%20bot)**`;
	public override info_remoji_vote_field = 'Głosuj na Remoji!';
	public override info_remoji_vote_value = (url: string): string => `**[GŁOSUJ NA TOP.GG](${url})**`;
	// TODO: e? y? a?
	public override info_remoji_created = 'Stworzone przez Shino.';
	// TODO: comma?
	public override info_remoji_version = (version: string, gitBranch: string, gitCommit: string): string =>
		`Remoji wersja ${version} ${gitBranch}-${gitCommit} - GNU AGPL 3.0`;
}
