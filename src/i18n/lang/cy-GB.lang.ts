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
import { I18NLanguage } from "..";
import { Nullable } from "../../core/utils/types";

import { Lang_en_US } from "./en-US.lang";

/**
 * Locale: cy-GB
 * Welsh
 */
export class Lang_cy_GB extends Lang_en_US {
  ping_success = (delay: number): string => `Pong! Hwyrni: ${delay}ms`;

  image_download_error_with_reason = (reason: Error): string => `Methu lawrlwyddio'r llun: \`${reason}\``;
  image_invalid_name = "Dydy yna ddim yn edrych fel enw cywir...";
  image_invalid_url = "Dydy yna ddim yn edrych fel URL cywir...";
  image_invalid_domain = "Dyd'r llun yna ddim wedi'i cynnal ar wefan caniateir. Triwch uwchlwytho is Discord cyntaf!";
  image_unknown_error = "Methu lawrlwythio'r llun. Digwyddodd gwall anhysbys.";
  image_upload_success = (name: string, emoji: string): string =>
    `:tada:  Uwchlwyddiodd \`:${name}:\` i'r gweinydd! ${emoji}`;
  image_upload_failed_unknown_error =
    "Methu uwchlwyddio'r emote. Digwyddodd gwall anhysbys. Triwch llun gwahanol, neu trio uwchlwythio'r llun i Discord cyntaf.";
  language_change_success = (oldLocale: Nullable<I18NLanguage>, newLocale: I18NLanguage): string =>
    `Wedi newid eich iaith yn lwwydiannus o \`${oldLocale ?? "dim"}\` i \`${newLocale}\``;

  embed_help_callout_title = "Angen help?";
  embed_remoji_author_name = "Remoji - Rheolwr emoji Discord.";
  embed_footer_tagline = "Remoji - Rheolwr emoji Discord. - Wedi creu gan Shino";
  embed_join_support_server_link = "Ymuno'r gweinydd cyfnogaeth!";
  embed_vote_callout_link = "Cliciwch yma i bleidleisio am Remoji!";

  command_error_guild_only = ":x: Gall y gorchymyn hyn dim ond cael ei ddefnyddio yn gweinyddau.";
  command_error_user_missing_permission = (permissions: PermissionString[]): string =>
    `Mae angen arnoch **chi** y caniatâd yn dilyn i defnyddio'r gweinydd hyn: ${permissions
      .map(perm => `\`${perm}\``)
      .join(", ")}`;
  command_error_bot_missing_permission = (permissions: PermissionString[]): string =>
    `Mae angen arno **Remoji** y caniatâd yn dilyn i defnyddio'r gweinydd hyn: ${permissions
      .map(perm => `\`${perm}\``)
      .join(", ")}`;
  command_error_vote_locked = (commandName: string, topggURL: string): string =>
    `:lock: I ddefnyddio'r gorchymyn \`/${commandName}\`, [pleidleisiwch am Remoji ar top.gg](${topggURL})!`;

  emote_copy_invalid_emote = "Could not find an emote to copy. Make sure you use a **custom** emote.";
  emote_copy_invalid_name =
    "That isn't a valid emote name. Emote names must be between 2-32 characters and may contain letters, numbers, and underscores.";
  emote_copy_invalid_url = "Could not download that emote. Maybe it was deleted?";
  emote_copy_invalid_domain =
    "Could not download that emote due to an invalid CDN domain name. Please report this error to the developers.";
  emote_copy_unknown_download_error = "An unknown error occurred while downloading that emote.";
  emote_copy_unknown_upload_error = "An unknown error occurred while uploading your emoji to Discord.";
  emote_copy_success = (name: string, newEmoji: string): string =>
    `:tada:  Copied \`:${name}:\` to your server! ${newEmoji}`;
}
