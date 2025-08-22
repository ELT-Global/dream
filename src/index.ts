import * as cron from "node-cron";
import { createSlackApp } from "./config/slack";
import { sendStandupMessage } from "./services/standup";
import { CronExpression } from "./utils/cron-expressions";

async function main() {
  const app = createSlackApp();

  await app.start(Number(Bun.env.PORT) || 3000);
  console.log("⚡️ Standup Bot running with Bun!");

  setInterval(() => {
    const now = new Date();
      process.stdout.write(`\r🕐 Current server time: ${now.toLocaleString()}`);
  }, 1000);
  cron.schedule(CronExpression.EVERY_DAY_AT_10_AM, () =>
    sendStandupMessage(app),
    {
      timezone: "Asia/Kolkata",
    }
  );

  console.log("Cron job scheduled for daily standup at 10 AM (Mon-Fri)");
}

main().catch(console.error);
