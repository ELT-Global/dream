import { App } from "@slack/bolt";

export function createSlackApp(): App {
  return new App({
    token: Bun.env.SLACK_BOT_TOKEN,
    signingSecret: Bun.env.SLACK_SIGNING_SECRET,
  });
}
