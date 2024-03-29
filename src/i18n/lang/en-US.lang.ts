/* eslint-disable @typescript-eslint/lines-between-class-members */

import { Nullable } from '@remoji-bot/core';
import { PermissionString } from 'discord.js';
import { I18N, I18NLanguage } from '..';

/**
 * Locale: en-US
 * US English
 */
export class Lang_en_US extends I18N {
	public NAME_DEFAULT = 'English';
	public NAME_LOCAL = 'English';

	public unknown_command = (): string => 'Unknown command!';

	public ping_success = (delay: number): string => `Pong! Latency: ${delay}ms`;

	public image_download_error_with_reason = (reason: Error): string =>
		`Could not download the image: \`${reason.message}\``;
	public image_invalid_name = "That doesn't look like a valid name...";
	public image_invalid_url = "That doesn't look like a valid URL...";
	public image_invalid_domain =
		"That image isn't hosted on an allowed website. Try uploading it to imgur or Discord first!";
	public image_unknown_error = "Couldn't download the image. An unknown error occurred.";
	public image_upload_success = (name: string, emoji: string): string =>
		`:tada:  Uploaded \`:${name}:\` to your server! ${emoji}`;
	public image_upload_failed_unknown_error =
		"Couldn't upload the emote. An unknown error occurred. Maybe try a different image, or try reuploading the image to Discord first.";
	public language_change_success = (oldLocale: Nullable<I18NLanguage>, newLocale: I18NLanguage): string =>
		`Successfully changed your language from \`${oldLocale ?? 'none'}\` to \`${newLocale}\``;

	public embed_help_callout_title = 'Need help?';
	public embed_remoji_author_name = 'Remoji - Discord emoji manager';
	public embed_footer_tagline = 'Remoji - Discord emoji manager - Created by Memikri';
	public embed_join_support_server_link = 'Join the support server';
	public embed_vote_callout_link = 'Click here to vote for Remoji!';

	public command_error_guild_only = ':x: This command can only be used in servers.';
	public command_error_user_missing_permission = (permissions: PermissionString[]): string =>
		`**You** need the following permissions to run this command: ${permissions
			.map((perm) => `\`${perm}\``)
			.join(', ')}`;
	public command_error_bot_missing_permission = (permissions: PermissionString[]): string =>
		`**Remoji** needs the following permissions to run this command: ${permissions
			.map((perm) => `\`${perm}\``)
			.join(', ')}`;
	public command_error_vote_locked = (commandName: string, topggURL: string): string =>
		`:lock: To unlock the \`/${commandName}\` command, [vote for Remoji on top.gg](${topggURL})!`;

	public emote_copy_invalid_emote = 'Could not find an emote to copy. Make sure you use a **custom** emote.';
	public emote_copy_invalid_name =
		"That isn't a valid emote name. Emote names must be between 2-32 characters and may contain letters, numbers, and underscores.";
	public emote_copy_invalid_url = 'Could not download that emote. Maybe it was deleted?';
	public emote_copy_invalid_domain =
		'Could not download that emote due to an invalid CDN domain name. Please report this error to the developers.';
	public emote_copy_unknown_download_error = 'An unknown error occurred while downloading that emote.';
	public emote_copy_unknown_upload_error = 'An unknown error occurred while uploading your emoji to Discord.';
	public emote_copy_success = (name: string, newEmoji: string): string =>
		`:tada:  Copied \`:${name}:\` to your server! ${newEmoji}`;
	public emote_copy_no_emotes = 'You need to provide at least 1 emote to copy.';
	public emote_copy_multiple_success = (failed: number, success: number): string =>
		`Successfully uploaded ${success} emojis! (Failed ${failed})`;

	public info_remoji_description =
		'Remoji is a super-simple but super-powerful emote manager bot for Discord. Among other features, Remoji allows you to ~~steal~~ *copy* or upload emotes to your server from directly in Discord, even on mobile!';
	public info_remoji_server_field = "Join Remoji's Discord server to stay up-to-date with new features!";
	public info_remoji_server_invite = (invite: string): string => `**[JOIN REMOJI'S DISCORD](${invite})**`;
	public info_remoji_bot_field = 'Invite Remoji!';
	public info_remoji_bot_invite = (appId: string, permissionBits: string): string =>
		`**[INVITE](https://discord.com/oauth2/authorize?client_id=${appId}&permissions=${permissionBits}&scope=applications.commands%20bot)**`;
	public info_remoji_vote_field = 'Vote for Remoji!';
	public info_remoji_vote_value = (url: string): string => `**[VOTE ON TOP.GG](${url})**`;
	public info_remoji_created = 'Created by Memikri.';
	public info_remoji_version = (version: string, gitBranch: string, gitCommit: string): string =>
		`Remoji version ${version} ${gitBranch}-${gitCommit} - GNU AGPL 3.0`;
}
