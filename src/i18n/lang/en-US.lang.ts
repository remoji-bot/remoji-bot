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

import { PermissionString } from "discord.js";
import { I18N, I18NLanguage } from "..";
import { Nullable } from "../../core/utils/types";

/**
 * Locale: en-US
 * US English
 */
export class Lang_en_US extends I18N {
  ping_success = (delay: number): string => `Pong! Latency: ${delay}ms`;

  image_download_error_with_reason = (reason: Error): string => `Could not download the image: \`${reason}\``;
  image_invalid_name = "That doesn't look like a valid name...";
  image_invalid_url = "That doesn't look like a valid URL...";
  image_invalid_domain = "That image isn't hosted on an allowed website. Try uploading it to imgur or Discord first!";
  image_unknown_error = "Couldn't download the image. An unknown error occurred.";
  image_upload_success = (name: string, emoji: string): string =>
    `:tada:  Uploaded \`:${name}:\` to this server! ${emoji}`;
  image_upload_failed_unknown_error =
    "Couldn't upload the emote. An unknown error occurred. Maybe try a different image, or try reuploading the image to Discord first.";
  language_change_success = (oldLocale: Nullable<I18NLanguage>, newLocale: I18NLanguage): string =>
    `Successfully changed your language from \`${oldLocale ?? "none"}\` to \`${newLocale}\``;

  embed_help_callout_title = "Need help?";
  embed_remoji_author_name = "Remoji - Discord emoji manager.";
  embed_footer_tagline = "Remoji - Discord emoji manager - Created by Shino";
  embed_join_support_server_link = "Join the support server";
  embed_vote_callout_link = "Click here to vote for Remoji!";

  command_error_guild_only = ":x: This command can only be used in servers.";
  command_error_user_missing_permission = (permissions: PermissionString[]): string =>
    `**You** need the following permissions to run this command: ${permissions.map(perm => `\`${perm}\``).join(", ")}`;
  command_error_bot_missing_permission = (permissions: PermissionString[]): string =>
    `**Remoji** needs the following permissions to run this command: ${permissions
      .map(perm => `\`${perm}\``)
      .join(", ")}`;
  command_error_vote_locked = (commandName: string, topggURL: string): string =>
    `:lock: To unlock the \`/${commandName}\` command, [vote for Remoji on top.gg](${topggURL})!`;
}
