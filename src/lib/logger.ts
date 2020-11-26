import chalk from "chalk";
import fs from "fs";
import path from "path";
import moment from "moment";
import { inspect } from "util";
import got from "got";

const LogLevel = Object.freeze({
  DEBUG: "DEBUG" as const,
  INFO: "INFO" as const,
  WARN: "WARN" as const,
  ERROR: "ERROR" as const,
});

const LogLevelOrdinal = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
};

const logger = {
  listeners: [
    {
      minLevel: LogLevel.DEBUG,
      consume: (level: keyof typeof LogLevel, message: unknown): void => {
        const format = {
          [LogLevel.DEBUG]: chalk.cyanBright,
          [LogLevel.INFO]: chalk.reset,
          [LogLevel.WARN]: chalk.yellowBright.bold,
          [LogLevel.ERROR]: chalk.redBright.bold,
        }[level];
        const timestamp = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
        // eslint-disable-next-line no-console
        console.log(format(`${timestamp} ${level}: ${message}`));
      },
    },
    {
      minLevel: LogLevel.DEBUG,
      consume: (level: keyof typeof LogLevel, message: unknown): void => {
        const timestamp = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
        const day = moment().format("YYYY-MM-DD");
        fs.mkdirSync(path.resolve(__dirname, "..", "..", "logs"), {
          recursive: true,
        });
        fs.appendFileSync(path.resolve(__dirname, "..", "..", "logs", `${day}.log`), `${timestamp} ${level}: ${message}\n`);
      },
    },
    {
      minLevel: LogLevel.INFO, // INFO
      consume: (level: keyof typeof LogLevel, message: string, wasString: boolean): void => {
        const color = {
          [LogLevel.DEBUG]: 0x55ffff,
          [LogLevel.INFO]: 0x0000aa,
          [LogLevel.WARN]: 0xffff55,
          [LogLevel.ERROR]: 0xff5555,
        }[level];
        const embed = {
          color,
          author: {
            name: `${level}`,
          },
          description: (wasString
            ? message.trim().substr(0, 2048)
            : `\`\`\`js
${message.trim().substr(0, 2000)}
\`\`\``
          ).replace(/[_*`|\\]g/, "\\$1"),
          timestamp: new Date(),
        };
        if (process.env.LOGGER_WEBHOOK_URL) {
          got(process.env.LOGGER_WEBHOOK_URL, {
            method: "POST",
            json: {
              embeds: [embed],
            },
          }).catch(err => logger.error(err));
        }
      },
    },
  ],

  log(level: keyof typeof LogLevel, message: unknown): void {
    if (!Object.values(LogLevel).includes(level)) {
      this.log(LogLevel.WARN, `Invalid level: ${level} - defaulting to INFO`);
      level = LogLevel.INFO;
    }
    const isString = typeof message === "string";
    if (!isString) message = inspect(message);
    for (const listener of this.listeners) {
      if (LogLevelOrdinal[level] >= LogLevelOrdinal[listener.minLevel]) {
        listener.consume(level, message as string, isString);
      }
    }
  },

  debug(message: unknown): void {
    return this.log(LogLevel.DEBUG, message);
  },

  info(message: unknown): void {
    return this.log(LogLevel.INFO, message);
  },

  warn(message: unknown): void {
    return this.log(LogLevel.WARN, message);
  },

  error(message: unknown): void {
    return this.log(LogLevel.ERROR, message);
  },
};

export default logger;
