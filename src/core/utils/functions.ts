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

import { Awaitable, Nullable } from "./types";

export function getenv(name: string, number?: false, assert?: false): string | null;
export function getenv(name: string, number: false, assert: true): string;
export function getenv(name: string, number: true, assert?: false): number | null;
export function getenv(name: string, number: true, assert: true): number;
/**
 * Get an environment variable.
 *
 * @param name the environment variable to get
 * @param number if true, ensures the value is a number
 * @param assert if true, an error will be thrown if the environment variable is not present
 * @returns the environment variable value
 */
export function getenv(name: string, number = false, assert = false): Nullable<string | number> {
  const value = process.env[name];
  if (typeof value !== "string") {
    if (assert) throw new TypeError(`Missing environment variable: ${name}`);
    return null;
  }

  if (number) {
    const parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed)) {
      if (assert) throw new TypeError(`Missing environment variable: ${name}`);
      return null;
    }
    return parsed;
  }

  return value;
}

/**
 * Time how long an async callback takes.
 *
 * @param cb - Thew callback to time.
 * @param args - The arguments for cb.
 * @returns - The time taken and the result.
 */
export async function time<T, P extends []>(
  cb: (...args: P) => Awaitable<T>,
  ...args: P
): Promise<[time: number, result: T]> {
  const before = Date.now();
  const res = await cb(...args);
  return [Date.now() - before, res];
}
