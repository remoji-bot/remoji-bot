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

import * as szBin from "7zip-bin";
import * as sz from "node-7z";

import * as chalk from "chalk";
import * as fs from "fs";
import { DateTime } from "luxon";
import * as path from "path";
import * as util from "util";

export enum LogLevel {
  VERBOSE,
  INFO,
  WARNING,
  ERROR,
}

const ERROR_COLORS = {
  [LogLevel.VERBOSE]: chalk.hsl(280, 45, 60),
  [LogLevel.INFO]: chalk.hsl(0, 0, 60),
  [LogLevel.WARNING]: chalk.hsl(60, 45, 60),
  [LogLevel.ERROR]: chalk.hsl(0, 45, 60),
};

const ERROR_TYPES = {
  [LogLevel.VERBOSE]: "D", // D = Debug
  [LogLevel.INFO]: "I",
  [LogLevel.WARNING]: "W",
  [LogLevel.ERROR]: "E",
};

const LOG_ROOT = path.join(__dirname, "..", "..", "logs");

export class Logger {
  private constructor() {
    // private because this is static-only
  }

  private static archiving = false;

  private static log(level: LogLevel, content: string, ...format: unknown[]): void {
    const now = DateTime.now().toUTC();

    const timestamp = now.toISO();
    const color = ERROR_COLORS[level];
    const type = ERROR_TYPES[level];
    const message = `${type} ${timestamp}: ${util.format(content, ...format)}`;

    process.stdout.write(color(message + "\n"));

    const filename = `${now.toISODate()}.log`;
    fs.mkdirSync(LOG_ROOT, { recursive: true });
    fs.appendFileSync(path.join(LOG_ROOT, filename), message + "\n");

    // Archive old log files using 7-zip

    const logfiles = fs.readdirSync(LOG_ROOT).sort();
    const needArchive = logfiles.filter(file => file.endsWith(".log") && file !== filename);

    if (!this.archiving && needArchive.length) {
      this.archiving = true;
      const stream = sz.update(
        path.join(LOG_ROOT, "archive.7z"),
        needArchive.map(file => path.join(LOG_ROOT, file)),
        {
          $bin: szBin.path7za,
          archiveType: "7z",
          method: ["0=lzma", "x=9", "fb=64", "d=32m", "s=on"],
        },
      );
      stream.on("end", () => {
        for (const file of needArchive) fs.rmSync(path.join(LOG_ROOT, file));
        this.log(LogLevel.INFO, `[Logger] Archived ${needArchive.length} log file(s): ${needArchive.join(", ")}`);
        this.archiving = false;
      });
    }
  }

  public static verbose(content: string, ...format: unknown[]): void {
    return this.log(LogLevel.VERBOSE, content, ...format);
  }

  public static info(content: string, ...format: unknown[]): void {
    return this.log(LogLevel.INFO, content, ...format);
  }

  public static warn(content: string, ...format: unknown[]): void {
    return this.log(LogLevel.WARNING, content, ...format);
  }

  public static error(content: string, ...format: unknown[]): void {
    return this.log(LogLevel.ERROR, content, ...format);
  }
}

/*

import * as chalk from "chalk";
import { DateTime } from "luxon";
import * as util from "util";

import { config } from "../config";
import * as fs from "fs";
import * as path from "path";
import { WebhookClient } from "discord.js";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const LOG_COLOR = Object.freeze({
  [LogLevel.DEBUG]: 0x55ffff,
  [LogLevel.INFO]: 0xaaaaaa,
  [LogLevel.WARN]: 0xffff55,
  [LogLevel.ERROR]: 0xff5555,
});

const LOG_LEVEL_NAME = Object.freeze({
  [LogLevel.DEBUG]: "DEBUG",
  [LogLevel.INFO]: "INFO",
  [LogLevel.WARN]: "WARN",
  [LogLevel.ERROR]: "ERROR",
});

const LOG_DIR = path.join(__dirname, "..", "..", "logs");
fs.mkdirSync(LOG_DIR, { recursive: true });

function trailingIndent(text: string, indent = "    ") {
  return text
    .split(/\r?\n/g)
    .map((line, index) => (index > 0 ? indent : "") + line)
    .join("\n");
}

const webhook = new WebhookClient(config.logger.webhook.id, config.logger.webhook.token, {
  allowedMentions: { parse: [] },
});

const webhookBuffer: string[] = [];
let lastWebhookBufferFlush = 0;

setInterval(() => {
  if (
    webhookBuffer.length > 0 &&
    (webhookBuffer.length > 5 || webhookBuffer.join("\n").length > 1000 || Date.now() - lastWebhookBufferFlush > 15000)
  ) {
    void webhook.send(webhookBuffer.splice(0).join(""), { code: "js", split: true });
    lastWebhookBufferFlush = Date.now();
  }
}, 10000);

function log(level: LogLevel, message: unknown) {
  const stringMessage = typeof message === "string" ? message : util.inspect(message);
  const levelName = LOG_LEVEL_NAME[level];

  const now = DateTime.now();

  const timestamp = now.toFormat("yyyy-MM-dd HH:mm:ss.SSS ZZZ");
  const prefix = `${timestamp} [${levelName}]: `;
  const output = `${prefix}${trailingIndent(stringMessage, "... : ")}\n`;

  // Console
  if (level >= LogLevel[config.logger.console.level]) {
    const hex = `#${LOG_COLOR[level].toString(16).padStart(6, "0")}`;
    const color = chalk.hex(hex);
    process.stdout.write(color(output));
  }

  // File
  if (level >= LogLevel[config.logger.file.level]) {
    const fileName = path.join(LOG_DIR, now.toFormat("yyyy-MM-dd") + ".log");
    fs.appendFileSync(fileName, output, { encoding: "utf-8" });
  }

  // Webhook
  if (level >= LogLevel[config.logger.webhook.level]) {
    webhookBuffer.push(output);
  }
}

const logger = {
  debug(message: unknown): void {
    log(LogLevel.DEBUG, message);
  },
  info(message: unknown): void {
    log(LogLevel.INFO, message);
  },
  warn(message: unknown): void {
    log(LogLevel.WARN, message);
  },
  error(message: unknown): void {
    log(LogLevel.ERROR, message);
  },
};

export default logger;
*/
