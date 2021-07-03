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

/**
 * Represents a value which can be used with `await`.
 * i.e. either a value or a Promise of that value.
 */
export type Awaitable<T> = T | Promise<T>;

/**
 * Either `T` or null.
 */
export type Nullable<T> = T | null;

/**
 * Conditional typing extension helper.
 *
 * 1. If `T extends SUPERTRUTHY`, then `TRUTHY`
 *
 * 2. If `T extends SUPERFALSY`, then `FALSY`
 *
 * 3. Else `FALLBACK`
 */
export type ExtendConditional<T, SUPERTRUTHY, TRUTHY, SUPERFALSY, FALSY, FALLBACK = never> = T extends SUPERTRUTHY
  ? TRUTHY
  : T extends SUPERFALSY
  ? FALSY
  : FALLBACK;

/**
 * Ternary helper function for typing.
 */
export type Ternary<FLAG extends boolean, TRUTHY, FALSY> = ExtendConditional<FLAG, true, TRUTHY, false, FALSY>;
