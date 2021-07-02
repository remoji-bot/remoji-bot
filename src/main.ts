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

import dotenv = require("dotenv-safe");

import { Bot } from "./core/bot";
import { Logger } from "./core/logger";

process.on("uncaughtException", error => {
  Logger.error(error);
  process.exit(1);
});
process.on("unhandledRejection", rejection => {
  Logger.error(rejection);
  process.exit(1);
});

dotenv.config({ allowEmptyValues: true });
void Bot.getInstance().connect();
