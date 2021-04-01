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
