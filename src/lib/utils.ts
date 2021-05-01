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

import * as assert from "assert";
import { Client, Embed, EmbedAuthor, EmbedAuthorOptions, EmbedField, EmbedFooterOptions, EmbedImageOptions, EmbedOptions } from "eris";

import logger from "./logger";
import Constants from "../Constants";

export function timeSync<T>(cb: () => T): [number, T] {
  const before = Date.now();
  const res = cb();
  return [Date.now() - before, res];
}

export async function time<T>(cb: () => Promise<T>): Promise<[number, T]> {
  const before = Date.now();
  const res = await cb();
  return [Date.now() - before, res];
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export enum TrimSide {
  LEFT,
  RIGHT,
  BOTH,
}
export function trimChars(str: string, side: TrimSide = TrimSide.BOTH, chars = " \t\r\n"): string {
  if (!str) return "";
  if (side === TrimSide.BOTH || side === TrimSide.LEFT) while (str.length > 0 && chars.indexOf(str.charAt(0)) >= 0) str = str.substr(1);
  if (side === TrimSide.BOTH || side === TrimSide.RIGHT)
    while (str.length > 0 && chars.indexOf(str.charAt(str.length - 1)) >= 0) str = str.substr(0, str.length - 1);
  return str;
}

export function getEmoteCDNLink(id: string, animated: boolean): string {
  return `https://cdn.discordapp.com/emojis/${id}.${animated ? "gif" : "png"}`;
}

export async function getRemainingGuildEmoteSlots(client: Client, guildID: string): Promise<[standard: number, animated: number]> {
  logger.debug(`getReminaingGuildEmoteSlots(guildID = ${guildID})`);
  const guild = client.guilds.get(guildID) ?? (await client.getRESTGuild(guildID));
  const totalSlots =
    {
      0: 50,
      1: 100,
      2: 150,
      3: 200,
    }[guild.premiumTier] ?? 0;
  const standard = totalSlots - guild.emojis.filter(e => !e.animated).length;
  const animated = totalSlots - guild.emojis.filter(e => e.animated).length;
  logger.debug(`getReminaingGuildEmoteSlots(guildID = ${guildID}) -> [standard: ${standard}, animated: ${animated}]`);
  return [standard, animated];
}

export type VariableType =
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function"
  | "asyncfunction"
  | "null";

export function gettype(value: unknown): VariableType {
  switch (typeof value) {
    case "bigint":
    case "boolean":
    case "number":
    case "string":
    case "symbol":
    case "undefined":
      return typeof value;
    case "function":
      if (value.constructor.name === "AsyncFunction") return "asyncfunction";
      else return "function";
    case "object":
      if (value === null) return "null";
      else return "object";
  }
}

export class EmbedBuilder {
  private author?: EmbedAuthorOptions;
  private color?: number;
  private description?: string;
  private fields?: EmbedField[];
  private footer?: EmbedFooterOptions;
  private image?: EmbedImageOptions;
  private thumbnail?: EmbedImageOptions;
  private timestamp?: Date;
  private title?: string;
  private readonly type: "rich" = "rich";
  private url?: string;

  public constructor(options?: Embed | EmbedOptions) {
    if (!options) return;
    this.setAuthor(options.author);
    this.setColor(options.color);
    this.setDescription(options.description);
    if (options.fields) for (const field of options.fields) this.addField(field);
    this.setFooter(options.footer);
    this.setImage(options.image);
    this.setThumbnail(options.thumbnail);
    this.setTimestamp(options.timestamp);
    this.setTitle(options.title);
    this.setURL(options.url);
  }

  public build(): Embed {
    return {
      author: this.author,
      color: this.color,
      description: this.description,
      fields: this.fields?.slice(),
      footer: this.footer,
      image: this.image,
      thumbnail: this.thumbnail,
      type: "rich",
      title: this.title,
      url: this.url,
    };
  }

  public getAuthor(): EmbedAuthor | null {
    return this.author ?? null;
  }

  public setAuthor(author: string | EmbedAuthor | null | undefined): this {
    switch (gettype(author)) {
      case "string":
        if (author) this.author = { name: author as string };
        else this.author = void 0;
        break;
      case "object":
        this.author = author as EmbedAuthor;
        break;
      case "null":
      case "undefined":
        this.author = void 0;
        break;
      default:
        throw new TypeError(`Invalid type for author parameter: ${gettype(author)}`);
    }
    return this;
  }

  public getColor(): number | null {
    return this.color ?? null;
  }

  public setColor(color: string | number | null | undefined): this {
    switch (gettype(color)) {
      case "string":
        assert.ok(/^#?[0-9a-f]{6}$/.test(color as string), "color is not a valid CSS string");
        this.color = Number.parseInt(trimChars(color as string, TrimSide.LEFT, "#"), 16);
        break;
      case "number":
        this.color = color as number;
        break;
      case "null":
      case "undefined":
        this.color = void 0;
        break;
      default:
        throw new TypeError(`Invalid type for color parameter: ${gettype(color)}`);
    }

    return this;
  }

  public getDescription(): string | null {
    return this.description ?? null;
  }

  public setDescription(description: string | null | undefined): this {
    switch (gettype(description)) {
      case "string":
        this.description = (description as string) || void 0;
        break;
      case "null":
      case "undefined":
        this.description = void 0;
        break;
      default:
        throw new TypeError(`Invalid type for description parameter: ${gettype(description)}`);
    }

    return this;
  }

  public getFields(): EmbedField[] | null {
    return this.fields ?? null;
  }

  public addField(field: EmbedField): this;
  public addField(name: string, value: string, inline?: boolean): this;
  public addField(arg0: EmbedField | string, arg1?: string, arg2?: boolean): this {
    let field: EmbedField;

    switch (gettype(arg0)) {
      case "object":
        field = { ...(arg0 as EmbedField) };
        break;
      case "string":
        field = { name: arg0 as string, value: arg1 as string, inline: arg2 };
        break;
      default:
        throw new TypeError(`Invalid type for argument 0: ${gettype(arg0)}`);
    }

    if (!this.fields) this.fields = [];
    this.fields.push(field);

    return this;
  }

  public getFooter(): EmbedFooterOptions | null {
    return this.footer ?? null;
  }

  public setFooter(footer: EmbedFooterOptions | null | undefined): this;
  public setFooter(text: string, iconURL?: string): this;
  public setFooter(arg0: EmbedFooterOptions | null | undefined | string, arg1?: string): this {
    switch (gettype(arg0)) {
      case "object":
        this.footer = arg0 as EmbedFooterOptions;
        break;
      case "string":
        this.footer = { text: arg0 as string, icon_url: arg1 };
        break;
      case "null":
      case "undefined":
        this.footer = void 0;
        break;
      default:
        throw new TypeError(`Invalid type for argument 0: ${gettype(arg0)}`);
    }

    return this;
  }

  public getImage(): EmbedImageOptions | null {
    return this.image ?? null;
  }

  public setImage(url: string): this;
  public setImage(image: EmbedImageOptions | null | undefined): this;
  public setImage(image: EmbedImageOptions | string | null | undefined): this {
    switch (gettype(image)) {
      case "object":
        this.image = { url: (image as EmbedImageOptions).url };
        break;
      case "string":
        this.image = { url: image as string };
        break;
      case "null":
      case "undefined":
        this.image = void 0;
        break;
      default:
        throw new TypeError(`Invalid type for image argument: ${gettype(image)}`);
    }

    return this;
  }

  public getThumbnail(): EmbedImageOptions | null {
    return this.thumbnail ?? null;
  }

  public setThumbnail(url: string): this;
  public setThumbnail(thumbnail: EmbedImageOptions | null | undefined): this;
  public setThumbnail(thumbnail: EmbedImageOptions | string | null | undefined): this {
    switch (gettype(thumbnail)) {
      case "object":
        this.thumbnail = { url: (thumbnail as EmbedImageOptions).url };
        break;
      case "string":
        this.thumbnail = { url: thumbnail as string };
        break;
      case "null":
      case "undefined":
        this.thumbnail = void 0;
        break;
      default:
        throw new TypeError(`Invalid type for thumbnail argument: ${gettype(thumbnail)}`);
    }

    return this;
  }

  public getTimestamp(): Date | null {
    return this.timestamp ?? null;
  }

  public setTimestamp(timestamp: Date | string | null | undefined): this {
    switch (gettype(timestamp)) {
      case "object": // Date
        this.timestamp = new Date(timestamp as Date);
        break;
      case "string": // Convert to Date
        this.timestamp = new Date(timestamp as string);
        break;
      case "null":
      case "undefined":
        this.timestamp = void 0;
        break;
      default:
        throw new TypeError(`Invalid type for timestamp argument: ${gettype(timestamp)}`);
    }
    return this;
  }

  public getTitle(): string | null {
    return this.title ?? null;
  }

  public setTitle(title: string | null | undefined): this {
    switch (gettype(title)) {
      case "string":
        this.title = (title as string) || void 0;
        break;
      case "null":
      case "undefined":
        this.title = void 0;
        break;
      default:
        throw new TypeError(`Invalid type for title parameter: ${gettype(title)}`);
    }

    return this;
  }

  public getURL(): string | null {
    return this.url ?? null;
  }

  public setURL(url: string | null | undefined): this {
    switch (gettype(url)) {
      case "string":
        this.url = (url as string) || void 0;
        break;
      case "null":
      case "undefined":
        this.url = void 0;
        break;
      default:
        throw new TypeError(`Invalid type for url parameter: ${gettype(url)}`);
    }

    return this;
  }
}

export class EmbedUtil {
  public static base(): EmbedBuilder {
    return new EmbedBuilder().setColor(0xfffffe).setAuthor({
      name: "Remoji - Discord Emoji Manager",
      url: Constants.topGG,
    });
  }

  public static error(description?: string): EmbedBuilder {
    return this.base().setColor(0xff5555).setDescription(description);
  }

  public static success(description?: string): EmbedBuilder {
    return this.base().setColor(0x55ff55).setDescription(description);
  }

  public static info(description?: string): EmbedBuilder {
    return this.base().setColor(0x5555ff).setDescription(description);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
}
