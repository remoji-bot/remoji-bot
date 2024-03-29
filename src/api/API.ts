/*
  Remoji - Discord emoji manager bot
  Copyright (C) 2022 Memikri <memikri1@gmail.com>.

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

import * as os from "os";
import { Logger } from "@remoji-bot/core";
import express from "express";
import { Bot } from "../core/Bot";
import { RedisStore } from "../core/data/redis/RedisStore";
import environment from "../environment";

/**
 * The API wrapper.
 */
export class API {
  private static instance: API | null = null;

  /**
   * Gets the instance of the API.
   *
   * @returns The instance of the API.
   */
  public static getInstance(): API {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  public logger: Logger;
  public app: express.Application;
  public router: express.Router;

  public authStore = new RedisStore("api:auth");

  private constructor() {
    this.logger = Logger.getLogger("API");
    this.app = express();
    this.router = express.Router();

    this.app.use(this.middleware.bind(this));

    this.app.use(this.router);

    this.router.get("/ping", this.ping.bind(this));
    this.router.get("/status", this.status.bind(this));
  }

  /**
   * Starts the API server.
   */
  public async start(): Promise<void> {
    const host = environment.API_HOST;
    const port = environment.API_PORT;

    await new Promise<void>(resolve => {
      this.app.listen(port, host, () => resolve());
    });
    this.logger.info(`API server started on ${host}:${port}`);
  }

  /**
   * Global middleware.
   *
   * @param req the request
   * @param res the response
   * @param next the next callback
   */
  public async middleware(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    // Remove X-Powered-By header
    res.removeHeader("X-Powered-By");
    // Set CORS headers
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Credentials", "true");

    // Set Content-Type header
    res.set("Content-Type", "application/json; charset=utf-8");

    // Set caching headers
    res.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
    res.set("Pragma", "no-cache");
    res.set("Expires", "0");

    // Set timeout
    req.setTimeout(environment.API_TIMEOUT, () => {
      res.status(408).json({ error: "Request timeout" });
      res.end();
    });

    // Log the request and Cloudflare origin IP
    const cfIP = req.headers["cf-connecting-ip"];
    this.logger.info(`${req.method} ${req.url} from ${req.ip}${cfIP ? `(cf: ${cfIP.toString()})` : ""}`);

    // Authenticate the request using the bearer token
    if (req.headers.authorization?.startsWith("Bearer ")) {
      const token = req.headers.authorization.split(" ")[1];
      const user = await this.authStore.get(token);
      if (!user || !Bot.getInstance().isDeveloper(user)) {
        res.status(401).json({ error: "Unauthorized" });
        res.end();
        return;
      }
    } else {
      res.status(401).header({ "WWW-Authenticate": "Bearer" }).json({ error: "Unauthorized" });
      res.end();
      return;
    }

    next();
  }

  /**
   * Pings the API.
   *
   * @param _req the request
   * @param res the response
   */
  private ping(_req: express.Request, res: express.Response): void {
    res.send("pong");
    res.end();
  }

  /**
   * Checks the status of the service.
   *
   * @param _req the request
   * @param res the response
   */
  private status(_req: express.Request, res: express.Response): void {
    const bot = Bot.getInstance();
    res.json({
      status: "ok",
      environment: environment.NODE_ENV,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: {
        load: os.loadavg()[0],
        total: os.loadavg()[1],
        used: os.loadavg()[2],
      },
      pid: process.pid,
      discord: {
        id: bot.client.user.id,
        guildCount: bot.client.guilds.cache.size,
        userCount: bot.client.users.cache.size,
        channels: bot.client.channels.cache.size,
      },
    });
    res.end();
  }
}
