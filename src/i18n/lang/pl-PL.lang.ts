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

	public override image_download_error_with_reason = (reason: Error): string =>
		`Nie udało się pobrać załącznika: \`${reason.message}\``;
	public override image_invalid_name = 'To nie wygląda jak poprawna nazwa...';
	public override image_invalid_url = 'To nie wygląda jak poprawny adres URL...';
	public override image_invalid_domain =
		'Ten załącznik nie jest umieszczony na dozwolonej stronie. Spróbuj użyć imgur.com albo wysłać jako załącznik na Discordzie!';
	public override image_unknown_error = 'Nie udało się pobrać załącznika z powodu nieznanego błędu.';
	public override image_upload_success = (name: string, emoji: string): string =>
		`:tada:  Przesłano \`:${name}:\` na Twój serwer! ${emoji}`;
	public override image_upload_failed_unknown_error =
		'Nie udało się przesłać emoji z powodu nieznanego błędu. Spróbuj użyć innego linku lub wysłać jako załącznik na Discordzie.';
	public override language_change_success = (oldLocale: Nullable<I18NLanguage>, newLocale: I18NLanguage): string =>
		`Pomyślnie zmieniono język${oldLocale ? ` z \`${oldLocale}` : ''} na \`${newLocale}\``;

	public override embed_help_callout_title = 'Potrzebujesz pomocy?';
	public override embed_remoji_author_name = 'Remoji - Menedżer dla Discord emoji';
	public override embed_footer_tagline = 'Remoji - Menedżer dla Discord emoji - Stworzony przez Shino';
	public override embed_join_support_server_link = 'Dołącz do serwera';
	public override embed_vote_callout_link = 'Kliknij tutaj aby głosować na Remoji!';

	public override command_error_guild_only = ':x: Ta komenda nie może być użyta w wiadomościach prywatnych.';
	public override command_error_user_missing_permission = (permissions: PermissionString[]): string =>
		`Aby użyć tej komendy, potrzebujesz tych uprawnień: ${permissions.map((perm) => `\`${perm}\``).join(', ')}`;
	public override command_error_bot_missing_permission = (permissions: PermissionString[]): string =>
		`Aby użyć tej komendy, Remoji potrzebuje tych uprawnień: ${permissions.map((perm) => `\`${perm}\``).join(', ')}`;
	public override command_error_vote_locked = (commandName: string, topggURL: string): string =>
		`:lock: aby użyć komendy \`/${commandName}\`, [zagłosuj na Remoji na top.gg](${topggURL})!`;

	public override emote_copy_invalid_emote =
		'Nie znaleziono emoji do skopiowania. Można kopiować tylko **niestandardowe** emoji.';
	public override emote_copy_invalid_name =
		'To nie jest poprawna nazwa dla emoji. Nazwa musi mieć od 2 do 32 znaków oraz składać się tylko z liter, cyfr lub znaków podkreślenia';
	public override emote_copy_invalid_url = 'Nie udało się pobrać emoji. Czy na pewno nie zostało usunięte?';
	public override emote_copy_invalid_domain =
		'Nie udało się pobrać emoji z powodu niepoprawnego adresu CDN. Prosimy o zgłoszenie tego błędu deweloperom.';
	public override emote_copy_unknown_download_error = 'Podczas pobierania emoji wystąpił nieznany błąd.';
	public override emote_copy_unknown_upload_error = 'Podczas przesyłania emoji na serwer wystąpił nieznany błąd.';
	public override emote_copy_success = (name: string, newEmoji: string): string =>
		`:tada:  Skopiowano \`:${name}:\` na Twój serwer! ${newEmoji}`;
	public override emote_copy_no_emotes = 'Musisz podać przynajmniej 1 emoji do skopiowania.';
	public override emote_copy_multiple_success = (failed: number, success: number): string =>
		`Pomyślnie przesłano ${success} emoji! (Niepomyślne: ${failed})`;

	public override info_remoji_description =
		'Remoji to bardzo prosty, ale też bardzo potężny bot do zarządzania emoji na Discordzie. Potrafi między innymi ~~kraść~~ *kopiować* i przesyłać emoji na Twój serwer bezpośrednio w Discordzie, nawet będąc na telefonie!';
	public override info_remoji_server_field = 'Dołącz do serwera Remoji aby być na bieżąco z nowymi funkcjami!';
	public override info_remoji_server_invite = (invite: string): string => `**[DOŁĄCZ DO SERWERA REMOJI](${invite})**`;
	public override info_remoji_bot_field = 'Dodaj Remoji!';
	public override info_remoji_bot_invite = (appId: string, permissionBits: string): string =>
		`**[LINK](https://discord.com/oauth2/authorize?client_id=${appId}&permissions=${permissionBits}&scope=applications.commands%20bot)**`;
	public override info_remoji_vote_field = 'Głosuj na Remoji!';
	public override info_remoji_vote_value = (url: string): string => `**[GŁOSUJ NA TOP.GG](${url})**`;
	public override info_remoji_created = 'Stworzony przez Shino.';
	public override info_remoji_version = (version: string, gitBranch: string, gitCommit: string): string =>
		`Remoji wersja ${version} ${gitBranch}-${gitCommit} - GNU AGPL 3.0`;
}
