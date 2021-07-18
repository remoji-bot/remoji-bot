import { ExtendConditional, Nullable } from '@remoji-bot/core';
import { PermissionString } from 'discord.js';

export type I18NValue<T extends unknown[] | false = false> = ExtendConditional<
	T,
	unknown[],
	(...params: T extends unknown[] ? T : never) => string,
	false,
	string
>;

export type I18NLanguage = 'en-US' | 'cy-GB' | 'nl-NL' | 'de-DE';

export const LANGUAGES: I18NLanguage[] = ['en-US', 'cy-GB', 'nl-NL', 'de-DE'];

/**
 * An abstract base class for i18n translations
 */
export abstract class I18N {
	public static readonly defaultLanguage: I18NLanguage = 'en-US';
	public static readonly languages: Readonly<Record<I18NLanguage, I18N>>;

	/**
	 * Initializes the language classes.
	 */
	public static async init(): Promise<void> {
		Reflect.defineProperty(I18N, 'languages', {
			value: Object.freeze({
				'cy-GB': new (await import('./lang/cy-GB.lang')).Lang_cy_GB(),
				'de-DE': new (await import('./lang/de-DE.lang')).Lang_de_DE(),
				'en-US': new (await import('./lang/en-US.lang')).Lang_en_US(),
				'nl-NL': new (await import('./lang/nl-NL.lang')).Lang_nl_NL(),
			}),
		});
	}

	/**
	 * Calculate the coverage of a language
	 *
	 * @param languageId - The language to check coverage for.
	 * @returns The coverage against the default language.
	 */
	public static getLanguageCoverage(
		languageId: I18NLanguage,
	): readonly [covered: readonly string[], uncovered: readonly string[]] {
		const language = I18N.languages[languageId];
		const covered: string[] = [];
		const uncovered: string[] = [];

		const defaultLanguage = I18N.languages[I18N.defaultLanguage];
		for (const key in defaultLanguage) {
			if (
				languageId === I18N.defaultLanguage ||
				String(Reflect.get(language, key)) !== String(Reflect.get(defaultLanguage, key))
			) {
				covered.push(key);
			} else {
				uncovered.push(key);
			}
		}

		return [covered, uncovered];
	}

	/**
	 * Gets the language coverage percentage between 0 and 1.
	 *
	 * @param languageId - The language to check coverage for.
	 * @returns The coverage percentage against the default language.
	 */
	public static getLanguageCoveragePercent(languageId: I18NLanguage): number {
		const [covered, uncovered] = I18N.getLanguageCoverage(languageId);
		return covered.length / (covered.length + uncovered.length);
	}

	abstract NAME_LOCAL: I18NValue;
	abstract NAME_DEFAULT: I18NValue;

	abstract unknown_command: I18NValue<[name: string]>;

	abstract ping_success: I18NValue<[latency: number]>;
	abstract image_invalid_name: I18NValue;
	abstract image_download_error_with_reason: I18NValue<[reason: Error]>;
	abstract image_invalid_url: I18NValue;
	abstract image_invalid_domain: I18NValue;
	abstract image_unknown_error: I18NValue;
	abstract image_upload_success: I18NValue<[emoji_name: string, emoji: string]>;
	abstract image_upload_failed_unknown_error: I18NValue;
	abstract language_change_success: I18NValue<[old_locale: Nullable<I18NLanguage>, new_locale: I18NLanguage]>;

	abstract embed_remoji_author_name: I18NValue;
	abstract embed_help_callout_title: I18NValue;
	abstract embed_join_support_server_link: I18NValue;
	abstract embed_vote_callout_link: I18NValue;
	abstract embed_footer_tagline: I18NValue;

	abstract command_error_guild_only: I18NValue;
	abstract command_error_user_missing_permission: I18NValue<[missing: PermissionString[]]>;
	abstract command_error_bot_missing_permission: I18NValue<[missing: PermissionString[]]>;
	abstract command_error_vote_locked: I18NValue<[command_name: string, topgg_vote_url: string]>;

	abstract emote_copy_invalid_emote: I18NValue;
	abstract emote_copy_invalid_name: I18NValue;
	abstract emote_copy_invalid_url: I18NValue;
	abstract emote_copy_invalid_domain: I18NValue;
	abstract emote_copy_unknown_download_error: I18NValue;
	abstract emote_copy_unknown_upload_error: I18NValue;
	abstract emote_copy_success: I18NValue<[name: string, new_emoji: string]>;
	abstract emote_copy_no_emotes: I18NValue;
	abstract emote_copy_multiple_success: I18NValue<[failed: number, success: number]>;

	abstract info_remoji_description: I18NValue;
	abstract info_remoji_server_field: I18NValue;
	abstract info_remoji_server_invite: I18NValue<[invite: string]>;
	abstract info_remoji_bot_field: I18NValue;
	abstract info_remoji_bot_invite: I18NValue<[appId: string, permissionBits: string]>;
	abstract info_remoji_vote_field: I18NValue;
	abstract info_remoji_vote_value: I18NValue<[url: string]>;
	abstract info_remoji_created: I18NValue;
	abstract info_remoji_version: I18NValue<[version: string, gitBranch: string, gitCommit: string]>;
}
