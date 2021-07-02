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

import axios from "axios";
import { URL } from "url";
import { Logger } from "../logger";

/**
 * Whitelisted domains for downloading images.
 */
export const DOMAIN_WHTIELIST: readonly string[] = ["i.imgur.com", "cdn.discordapp.com", "media.discordapp.net"];

/**
 * Regular expression for match an `http:` or `https:` URL.
 */
export const REGEXP_URL =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

/**
 * List of allowed image mime-types.
 */
export const MIME_WHITELIST: readonly string[] = ["image/jpeg", "image/png", "image/gif"];

/**
 * Represents a result from `ImageUtil.downloadImage()`.
 */
export type DownloadImageResult =
  | {
      success: true;
      type: string;
      data: ArrayBuffer;
    }
  | {
      success: false;
      validURL?: boolean;
      whitelistedURL?: boolean;
      error?: Error;
    };

/**
 * Utilities for uploading/downloading images and emojis.
 */
export class ImageUtil {
  private constructor() {
    // private
  }

  /**
   * Attempts to download an image from the given URL that is valid for an emoji.
   *
   * @param url - the url to download from - will be sanitized and checked
   * @returns - the result
   */
  static async downloadImage(url: string): Promise<DownloadImageResult> {
    try {
      if (!REGEXP_URL.test(url)) return { success: false, validURL: false };
      const parsedURL = new URL(url);
      if (!DOMAIN_WHTIELIST.includes(parsedURL.hostname))
        return { success: false, validURL: true, whitelistedURL: false };

      const image = await axios
        .get<ArrayBuffer>(parsedURL.toString(), {
          responseType: "arraybuffer",
          maxContentLength: 256_000,
          maxRedirects: 0,
          timeout: 2500,
        })
        .then(res => {
          if (!MIME_WHITELIST.includes(res.headers["content-type"]))
            throw new TypeError(`Unknown Content-Type: ${res.headers["content-type"]}`);
          return res;
        })
        .catch((error: Error) => {
          Logger.error(error);
          return error;
        });
      if (image instanceof Error) return { success: false, validURL: true, whitelistedURL: true, error: image };

      return {
        success: true,
        type: image.headers["content-type"],
        data: image.data,
      };
    } catch (error) {
      return { success: false, error };
    }
  }
}
