import { URL } from 'url';
import { inspect } from 'util';
import { Logger } from '@remoji-bot/core';
import axios from 'axios';
import { Snowflake } from 'discord.js';

/**
 * Whitelisted domains for downloading images.
 */
export const DOMAIN_WHTIELIST: readonly string[] = ['i.imgur.com', 'cdn.discordapp.com', 'media.discordapp.net'];

/**
 * Regular expression for match an `http:` or `https:` URL.
 */
export const REGEXP_URL =
	/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

/**
 * List of allowed image mime-types.
 */
export const MIME_WHITELIST: readonly string[] = ['image/jpeg', 'image/png', 'image/gif'];

/**
 * Regular expression to match a single emote.
 */
export const REGEXP_EMOTE = /^<(?<animated>a)?:(?<name>[a-zA-Z0-9_]{2,32}):(?<id>\d{17,20})>$/;

/**
 * Regular expression to match multiple emotes.
 */
export const REGEXP_ALL_EMOTES = /<(?<animated>a)?:(?<name>[a-zA-Z0-9_]{2,32}):(?<id>\d{17,20})>/g;

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
 * Stores basic information about an emoji.
 */
export class EmojiInfo {
	public constructor(public readonly id: Snowflake, public readonly name: string, public readonly animated: boolean) {}

	/**
	 * The CDN URL.
	 *
	 * @returns - The CDN URL.
	 */
	public get url(): string {
		const extension = this.animated ? 'gif' : 'png';
		return `https://cdn.discordapp.com/emojis/${this.id}.${extension}`;
	}
}

/**
 * Utilities for uploading/downloading images and emojis.
 */
export class ImageUtil extends null {
	public static logger = Logger.getLogger('imageutil');

	/**
	 * Extract all emojis from a given input string.
	 *
	 * @param string - The input string.
	 * @returns - The emojis extracted from the input string.
	 */
	public static extractEmojis(string: string): EmojiInfo[] {
		const matches = Array.from(string.matchAll(REGEXP_ALL_EMOTES));
		return (
			matches
				.filter((match) => match.groups)
				// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
				.map((match) => new EmojiInfo(match.groups?.id!, match.groups?.name!, Boolean(match.groups?.animated)))
		);
	}

	/**
	 * Get the Discord CDN asset URL for an emoji.
	 *
	 * @param emoji - The emoji to get the asset URL for.
	 * @returns - The asset URL.
	 */
	public static getEmojiCDNImageURL(emoji: string): string | null {
		const groups = REGEXP_EMOTE.exec(emoji)?.groups;

		if (!groups) return null;

		const extension = groups.animated ? 'gif' : 'png';
		return `https://cdn.discordapp.com/emojis/${groups.id}.${extension}`;
	}

	/**
	 * Attempts to download an image from the given URL that is valid for an emoji.
	 *
	 * @param url - the url to download from - will be sanitized and checked
	 * @returns - the result
	 */
	public static async downloadImage(url: string): Promise<DownloadImageResult> {
		try {
			if (!REGEXP_URL.test(url)) return { success: false, validURL: false };
			const parsedURL = new URL(url);
			if (!DOMAIN_WHTIELIST.includes(parsedURL.hostname))
				return { success: false, validURL: true, whitelistedURL: false };

			const image = await axios
				.get<ArrayBuffer>(parsedURL.toString(), {
					responseType: 'arraybuffer',
					maxContentLength: 256_000,
					maxRedirects: 0,
					timeout: 2500,
				})
				.then((res) => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
					if (!MIME_WHITELIST.includes(res.headers['content-type'])) throw new TypeError(`Unknown Content-Type`);
					return res;
				})
				.catch((error: Error) => {
					this.logger.error(error);
					return error;
				});
			if (image instanceof Error) return { success: false, validURL: true, whitelistedURL: true, error: image };

			return {
				success: true,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				type: image.headers['content-type'],
				data: image.data,
			};
		} catch (error) {
			return { success: false, error: error instanceof Error ? error : new Error(inspect(error)) };
		}
	}
}
