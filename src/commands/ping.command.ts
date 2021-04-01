import { Command, permissionCheck } from "../lib/command";
import eris from "eris";
import { stripIndents } from "common-tags";
import { time } from "../lib/utils";

export class PingCommand extends Command {
  constructor() {
    super({
      name: "ping",
      aliases: [],
      checks: {},
    });
  }

  async run(message: eris.Message): Promise<void> {
    const [elapsed, reply] = await time(() => this.bot.client.createMessage(message.channel.id, "Pong!"));
    await reply.edit(stripIndents`
        Pong!
        Message Edit: ${elapsed}ms
        Websocket: ${Math.floor(this.bot.client.shards.reduce((a, s) => a + s.latency, 0) / this.bot.client.shards.size)}ms`);
  }
}
