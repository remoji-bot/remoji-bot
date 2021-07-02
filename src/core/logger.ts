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

/**
 * Logs messages to the console and log files, and manages archival of old log files.
 */
export class Logger {
  private constructor() {
    // private because this is static-only
  }

  private static archiving = false;

  /**
   * Log a new message.
   *
   * @param level - The log's level.
   * @param content - The log message.
   * @param format - The log format.
   */
  private static log(level: LogLevel, content: unknown, ...format: unknown[]): void {
    if (typeof content !== "string") content = util.inspect(content);
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

  /**
   * Log verbosely.
   *
   * @param content - The log message content.
   * @param format - The log format.
   */
  public static verbose(content: unknown, ...format: unknown[]): void {
    if (typeof content !== "string") content = util.inspect(content);
    this.log(LogLevel.VERBOSE, content, ...format);
  }

  /**
   * Log infoly.
   *
   * @param content - The log message content.
   * @param format - The log format.
   */
  public static info(content: unknown, ...format: unknown[]): void {
    if (typeof content !== "string") content = util.inspect(content);
    this.log(LogLevel.INFO, content, ...format);
  }

  /**
   * Log warnly.
   *
   * @param content - The log message content.
   * @param format - The log format.
   */
  public static warn(content: unknown, ...format: unknown[]): void {
    if (typeof content !== "string") content = util.inspect(content);
    this.log(LogLevel.WARNING, content, ...format);
  }

  /**
   * Log errorly.
   *
   * @param content - The log message content.
   * @param format - The log format.
   */
  public static error(content: unknown, ...format: unknown[]): void {
    if (typeof content !== "string") content = util.inspect(content);
    this.log(LogLevel.ERROR, content, ...format);
  }
}
