/* eslint-disable @typescript-eslint/lines-between-class-members */

import { Nullable } from '@remoji-bot/core';
import { PermissionString } from 'discord.js';
import { Lang_en_US } from './en-US.lang';
import { I18NLanguage } from '..';

/**
 * Locale: cy-GB
 * Welsh
 *
 * Translated by: vcokltfre
 */
export class Lang_cy_GB extends Lang_en_US {
	public override NAME_DEFAULT = 'Welsh';
	public override NAME_LOCAL = 'Cymraeg';

	public override unknown_command = (): string => 'Gorchymyn anhysbys!';

	public override ping_success = (delay: number): string => `Pong! Hwyrni: ${delay}ms`;

	public override image_download_error_with_reason = (reason: Error): string =>
		`Methu lawrlwyddio'r llun: \`${reason.message}\``;
	public override image_invalid_name = 'Dydy yna ddim yn edrych fel enw cywir...';
	public override image_invalid_url = 'Dydy yna ddim yn edrych fel URL cywir...';
	public override image_invalid_domain =
		"Dydy'r llun yna ddim wedi'i cynnal ar wefan caniateir. Triwch uwchlwytho i Discord cyntaf!";
	public override image_unknown_error = "Methu lawrlwythio'r llun. Digwyddodd gwall anhysbys.";
	public override image_upload_success = (name: string, emoji: string): string =>
		`:tada:  Uwchlwyddiodd \`:${name}:\` i'r gweinydd! ${emoji}`;
	public override image_upload_failed_unknown_error =
		"Methu uwchlwyddio'r emote. Digwyddodd gwall anhysbys. Triwch llun gwahanol, neu trio uwchlwythio'r llun i Discord cyntaf.";
	public override language_change_success = (oldLocale: Nullable<I18NLanguage>, newLocale: I18NLanguage): string =>
		`Wedi newid eich iaith yn lwyddiannus o \`${oldLocale ?? 'dim'}\` i \`${newLocale}\``;

	public override embed_help_callout_title = 'Angen help?';
	public override embed_remoji_author_name = 'Remoji - Rheolwr emoji Discord.';
	public override embed_footer_tagline = 'Remoji - Rheolwr emoji Discord. - Wedi creu gan Shino';
	public override embed_join_support_server_link = "Ymuno'r gweinydd cyfnogaeth!";
	public override embed_vote_callout_link = 'Cliciwch yma i bleidleisio am Remoji!';

	public override command_error_guild_only = ':x: Gall y gorchymyn hyn dim ond cael ei ddefnyddio yn gweinyddau.';
	public override command_error_user_missing_permission = (permissions: PermissionString[]): string =>
		`Mae angen arnoch **chi** y caniatâd yn dilyn i ddefnyddio'r gorchymyn hyn: ${permissions
			.map((perm) => `\`${perm}\``)
			.join(', ')}`;
	public override command_error_bot_missing_permission = (permissions: PermissionString[]): string =>
		`Mae angen arno **Remoji** y caniatâd yn dilyn i ddefnyddio'r gorchymyn hyn: ${permissions
			.map((perm) => `\`${perm}\``)
			.join(', ')}`;
	public override command_error_vote_locked = (commandName: string, topggURL: string): string =>
		`:lock: I ddefnyddio'r gorchymyn \`/${commandName}\`, [pleidleisiwch am Remoji ar top.gg](${topggURL})!`;

	public override emote_copy_invalid_emote =
		'Methu darganfod emoji i gopio. Byddwych yn siwr i ddefnyddio emoji **arferiad**.';
	public override emote_copy_invalid_name =
		'Dydy yna ddim yn enw dilys am emoji. Raid i enwau emoji fod rhwyng 2-32 llythr a dim ond cynnwys llythrennau, rhifau, a thanlinellu.';
	public override emote_copy_invalid_url = "Methu lawrlwythio'r emoji yna. Efallau ei wedi dileu?";
	public override emote_copy_invalid_domain =
		"Methu lawrlwythio'r emoji yna oherwydd enw parth CDN annilys. Cysylltwch â'r datblygwyr am y broblem hwn.";
	public override emote_copy_unknown_download_error = "Digwyddodd gawll anhysbys tra'n lawrlwythio'r emoji yna.";
	public override emote_copy_unknown_upload_error =
		"Digwyddodd gawll anhysbys tra'n uwchlwythio'r emoji yna i Discord.";
	public override emote_copy_success = (name: string, newEmoji: string): string =>
		`:tada:  Wedi copio \`:${name}:\` i eich gweinydd! ${newEmoji}`;
	public override emote_copy_no_emotes = 'Rhaid darparu un neu fwy emotes i gopio.';
	public override emote_copy_multiple_success = (failed: number, success: number): string =>
		`Wedi lanlwythio ${success} emojis yn llwyddiannus! (Methu ${failed})`;

	public override info_remoji_description =
		'Mae Remoji yn rheolwy emoji syml ond pwerys iawn. Ymhlith defnyddiau eraill, mae Remoji yn caniatâu iidych chi ~~dwyn~~ *copio* new lanlwythion emojis i eich gweinydd chi, yn syth yn Discord, hyd yn oed ar eich ffôn!';
	public override info_remoji_server_field =
		"Ymunwch â'r gweinydd cefnogaeth Remoji i gael y wybodaeth ddiweddaraf am nodweddion newydd!";
	public override info_remoji_server_invite = (invite: string): string => `**[YMUNWCH â DISCORD REMOJI](${invite})**`;
	public override info_remoji_bot_field = 'Gwahodd Remoji!';
	public override info_remoji_bot_invite = (appId: string, permissionBits: string): string =>
		`**[GWAHODD](https://discord.com/oauth2/authorize?client_id=${appId}&permissions=${permissionBits}&scope=applications.commands%20bot)**`;
	public override info_remoji_vote_field = 'Pleidleisiwch am Remoji!';
	public override info_remoji_vote_value = (url: string): string => `**[PLEIDLEISIWCH AR TOP.GG](${url})**`;
	public override info_remoji_created = 'Wedi creu gan Shino.';
	public override info_remoji_version = (version: string, gitBranch: string, gitCommit: string): string =>
		`Fersiwn Remoji ${version} ${gitBranch}-${gitCommit} - GNU AGPL 3.0`;
}
