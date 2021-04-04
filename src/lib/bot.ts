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

import eris from "eris";

import logger from "./logger";

export interface BotOptions {
  token: string;
  erisOptions?: eris.ClientOptions;
}

export class Bot {
  private static instance?: Bot;
  static getInstance(): Bot {
    if (!this.instance) throw new ReferenceError("bot instance is not yet defined");
    return this.instance;
  }

  readonly client: eris.Client;
  protected ready = false;

  constructor(options: BotOptions) {
    this.client = new eris.Client(options.token, options.erisOptions);
    this.client.once("ready", this.onReady.bind(this));
    this.client.on("error", this.onError.bind(this));
    Bot.instance = this;
  }

  private onReady() {
    this.ready = true;
  }

  private onError(error: Error): void {
    logger.error(error);
  }

  login(): Promise<void> {
    void this.client.connect();
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        this.client.off("ready", resolve);
        this.client.off("error", reject);
      };
      this.client.once("ready", () => {
        cleanup();
        resolve();
      });
      this.client.once("error", () => {
        cleanup();
        reject();
      });
    });
  }
}
