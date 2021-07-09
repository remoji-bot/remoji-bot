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
import { Nullable } from "@remoji-bot/core";
import { Lang_en_US } from "./en-US.lang";

/**
 * Locale: nl-NL
 * Dutch (Nederlands)
 *
 * Translated by: cyarox
 */
export class Lang_nl_NL extends Lang_en_US {
  ping_success = (delay: number): string => `Pong! Vertraging: ${delay}ms`;

  image_download_error_with_reason = (reason: Error): string => `Kon afbeelding niet downloaden: \`${reason}\``;
  image_invalid_name = "Dat lijkt niet op een geldige naam...";
  image_invalid_url = "Dat lijkt niet op een geldige URL...";
  image_invalid_domain =
    "Die afbeelding wordt niet gehost op een toegestane website. Probeer om het eerst naar imgur of Discord te uploaden!";
  image_unknown_error = "Kon de afbeelding niet downloaden, een onbekende error heeft plaatsgevonden.";
  image_upload_success = (name: string, emoji: string): string =>
    `:tada:  Uploaded \`:${name}:\` naar je server! ${emoji}`;
  image_upload_failed_unknown_error =
    "Kon de emote niet uploaden. Een onbekende error heeft plaatsgevonden. Probeer een andere afbeelding, of probeer de afbeelding naar Discord opnieuw te uploaden.";
  language_change_success = (oldLocale: Nullable<I18NLanguage>, newLocale: I18NLanguage): string =>
    `Je taal is succesvol veranderd van \`${oldLocale ?? "niks"}\` naar \`${newLocale}\``;

  embed_help_callout_title = "Hulp nodig?";
  embed_remoji_author_name = "Remoji - Discord emoji manager.";
  embed_footer_tagline = "Remoji - Discord emoji manager - Gemaakt door Shino";
  embed_join_support_server_link = "Join de support server";
  embed_vote_callout_link = "Klik hier om op Remoji te stemmen!";

  command_error_guild_only = ":x: Deze command kan alleen in jouw servers worden gebruikt.";
  command_error_user_missing_permission = (permissions: PermissionString[]): string =>
    `**Jij** hebt de volgende machtigingen nodig om deze command te kunnen gebruiken: ${permissions
      .map(perm => `\`${perm}\``)
      .join(", ")}`;
  command_error_bot_missing_permission = (permissions: PermissionString[]): string =>
    `**Remoji** heeft de volgende machtigingen nodig om deze command te kunnen gebruiken: ${permissions
      .map(perm => `\`${perm}\``)
      .join(", ")}`;
  command_error_vote_locked = (commandName: string, topggURL: string): string =>
    `:lock: Om \`/${commandName}\` te kunnen gebruiken, [stem voor Remoji op top.gg](${topggURL})!`;

  emote_copy_invalid_emote =
    "Kon geen emote vinden om te kopiëren. Zorg ervoor dat je een **aangepaste** emote gebruikt.";
  emote_copy_invalid_name =
    "Dat is geen valide emote naam. Emote namen moet tussen 2-32 tekens zijn en kan letters, nummers en onderstrepingstekens bevatten.";
  emote_copy_invalid_url = "Kon deze emote niet downloaden. Misschien is het verwijdered?";
  emote_copy_invalid_domain =
    "Kan deze emote niet downloaden vanwege een invalide CDN domain naam. Meld alstublieft deze error bij de developers.";
  emote_copy_unknown_download_error = "Een onbekende error heeft plaatsgevonden tijdens het downloaden van die emote.";
  emote_copy_unknown_upload_error =
    "Een onbekende error heeft plaatsgevonde tijdens het uploaden van je emote naar Discord.";
  emote_copy_success = (name: string, newEmoji: string): string =>
    `:tada:  \`:${name}:\` is naar je server gekopieerd! ${newEmoji}`;
}
