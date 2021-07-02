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

import * as functions from "./functions";

test("getenv", () => {
  let i = 0;
  const genKey = () => {
    const randomKey = Math.floor(Math.random() * 0xffffffff)
      .toString(32)
      .toUpperCase();
    return `TEST_${randomKey}_${i++}`;
  };

  // Plain strings
  const key1 = genKey();
  process.env[key1] = "foo";

  expect(functions.getenv(key1)).toStrictEqual("foo");
  expect(functions.getenv(key1, true)).toBeNull();
  expect(() => functions.getenv(key1, true, true)).toThrowError();

  // Unset
  const key2 = genKey();

  expect(functions.getenv(key2)).toBeNull();
  expect(functions.getenv(key2, true)).toBeNull();
  expect(() => functions.getenv(key2, true, true)).toThrowError();
  expect(() => functions.getenv(key2, false, true)).toThrowError();

  // Floating-point
  const key3 = genKey();
  process.env[key3] = "123.456";

  expect(functions.getenv(key3)).toStrictEqual("123.456");
  expect(functions.getenv(key3, true)).toBeCloseTo(123.456);
  expect(functions.getenv(key3, true, true)).toBeCloseTo(123.456);

  // Integers
  const key4 = genKey();
  process.env[key4] = "-123";

  expect(functions.getenv(key4)).toStrictEqual("-123");
  expect(functions.getenv(key4, true)).toBeCloseTo(-123);
  expect(functions.getenv(key4, true, true)).toBeCloseTo(-123);
});

test("time", async () => {
  const wait = (timeout: number) => new Promise(r => setTimeout(r, timeout));
  const wait500OK = () => wait(5).then(() => "OK");
  const [time, result] = await functions.time(wait500OK);
  expect(time).toBeGreaterThanOrEqual(5);
  expect(result).toStrictEqual("OK");
});
