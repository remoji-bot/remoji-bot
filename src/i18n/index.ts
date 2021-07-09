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
import { ExtendConditional, Nullable } from "../core/utils/types";

export type I18NValue<T extends unknown[] | false = false> = ExtendConditional<
  T,
  unknown[],
  (...params: T extends unknown[] ? T : never) => string,
  false,
  string
>;

export type I18NLanguage = "en-US" | "cy-GB" | "nl-NL" | "de-DE";

/**
 * An abstract base class for i18n translations
 */
export abstract class I18N {
  // abstract LANGUAGE_NAME_LOCAL: I18NValue;
  // abstract LANGUAGE_NAME_ENGLISH: I18NValue;
  abstract ping_success: I18NValue<[latency: number]>;
  abstract image_invalid_name: I18NValue;
  abstract image_download_error_with_reason: I18NValue<[reason: Error]>;
  abstract image_invalid_url: I18NValue;
  abstract image_invalid_domain: I18NValue;
  abstract image_unknown_error: I18NValue;
  abstract image_upload_success: I18NValue<[emoji_name: string, emoji: string]>;
  abstract image_upload_failed_unknown_error: I18NValue;
  abstract language_change_success: I18NValue<[old_locale: Nullable<I18NLanguage>, new_locale: I18NLanguage]>;

  abstract embed_remoji_author_name: I18NValue;
  abstract embed_help_callout_title: I18NValue;
  abstract embed_join_support_server_link: I18NValue;
  abstract embed_vote_callout_link: I18NValue;
  abstract embed_footer_tagline: I18NValue;

  abstract command_error_guild_only: I18NValue;
  abstract command_error_user_missing_permission: I18NValue<[missing: PermissionString[]]>;
  abstract command_error_bot_missing_permission: I18NValue<[missing: PermissionString[]]>;
  abstract command_error_vote_locked: I18NValue<[command_name: string, topgg_vote_url: string]>;

  abstract emote_copy_invalid_emote: I18NValue;
  abstract emote_copy_invalid_name: I18NValue;
  abstract emote_copy_invalid_url: I18NValue;
  abstract emote_copy_invalid_domain: I18NValue;
  abstract emote_copy_unknown_download_error: I18NValue;
  abstract emote_copy_unknown_upload_error: I18NValue;
  abstract emote_copy_success: I18NValue<[name: string, new_emoji: string]>;
}
