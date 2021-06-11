import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import { assert, object, pattern, string, Struct } from "superstruct";

const snowflake = () => pattern(string(), /^[1-9]\d{17,20}$/) as Struct<`${bigint}`, null>;

const struct = object({
  bot: object({
    token: string(),
    publicKey: string(),
    applicationID: snowflake(),
  }),
  commandTestingGuild: snowflake(),
  topggToken: string(),
});

type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };
type ConvertStruct<T> = T extends Struct<infer R> ? R : never;

export type Config = ConvertStruct<typeof struct>;

const content = yaml.load(fs.readFileSync(path.join(__dirname, "..", "config.yml"), "utf8"));
assert(content, struct);

export const config: DeepReadonly<Config> = content;
