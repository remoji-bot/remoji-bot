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
export type ErisPermissionKeys =
  | "createInstantInvite"
  | "kickMembers"
  | "banMembers"
  | "administrator"
  | "manageChannels"
  | "manageGuild"
  | "addReactions"
  | "viewAuditLogs"
  | "voicePrioritySpeaker"
  | "stream"
  | "readMessages"
  | "sendMessages"
  | "sendTTSMessages"
  | "manageMessages"
  | "embedLinks"
  | "attachFiles"
  | "readMessageHistory"
  | "mentionEveryone"
  | "externalEmojis"
  | "viewGuildInsights"
  | "voiceConnect"
  | "voiceSpeak"
  | "voiceMuteMembers"
  | "voiceDeafenMembers"
  | "voiceMoveMembers"
  | "voiceUseVAD"
  | "changeNickname"
  | "manageNicknames"
  | "manageRoles"
  | "manageWebhooks"
  | "manageEmojis"
  | "all"
  | "allGuild"
  | "allText"
  | "allVoice";

export function timeSync<T>(cb: () => T): [number, T] {
  const before = Date.now();
  const res = cb();
  return [Date.now() - before, res];
}

export async function time<T>(cb: () => Promise<T>): Promise<[number, T]> {
  const before = Date.now();
  const res = await cb();
  return [Date.now() - before, res];
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
