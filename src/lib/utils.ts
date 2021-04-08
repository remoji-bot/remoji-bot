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

import { Client } from "eris";

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

export function getEmoteCDNLink(id: string, animated: boolean): string {
  return `https://cdn.discordapp.com/emojis/${id}.${animated ? "gif" : "png"}`;
}

export async function getRemainingGuildEmoteSlots(client: Client, guildID: string): Promise<[standard: number, animated: number]> {
  // This is a work-around to fetch a guild while not in REST mode in eris.
  const guild = await client.getRESTGuild(guildID);
  const totalSlots =
    {
      0: 50,
      1: 100,
      2: 150,
      3: 200,
    }[guild.premiumTier] ?? 0;
  return [totalSlots - guild.emojis.filter(e => !e.animated).length, totalSlots - guild.emojis.filter(e => e.animated).length];
}
