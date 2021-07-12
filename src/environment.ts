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

import dotenv = require("dotenv");
import { getenv } from "@remoji-bot/core";

dotenv.config();

const environment = Object.freeze({
  NODE_ENV: getenv("NODE_ENV", false, true),

  API_PORT: getenv("API_PORT", true, true),
  API_HOST: getenv("API_HOST", false, true),
  API_TIMEOUT: getenv("API_TIMEOUT", true, true),

  REDIS_PORT: getenv("REDIS_PORT", true, false),
  REDIS_HOST: getenv("REDIS_HOST", false, false),

  DISCORD_TOKEN: getenv("DISCORD_TOKEN", false, true),
  DISCORD_APPLICATION_ID: getenv("DISCORD_APPLICATION_ID", false, true),
  DISCORD_PUBLIC_KEY: getenv("DISCORD_PUBLIC_KEY", false, true),
  TESTING_GUILD_ID: getenv("TESTING_GUILD_ID", false, false),
  DEVELOPER_ID: getenv("DEVELOPER_ID", false, false),

  TOPGG_TOKEN: getenv("TOPGG_TOKEN", false, true),
  TOPGG_VOTE_URL: getenv("TOPGG_VOTE_URL", false, true),

  SUPPORT_INVITE: getenv("SUPPORT_INVITE", false, true),
});

export default environment;
