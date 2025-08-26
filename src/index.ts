import * as cron from "node-cron";
import { createSlackApp } from "./config/slack";
import { sendStandupMessage } from "./services/standup";
import { CronExpression } from "./utils/cron-expressions";
import { connectMongoDB } from "./database/db";
import { createUserJsonFile } from "./services/users";
import { registerNextCommand } from "./commands/next.command";

async function main() {
  const app = createSlackApp();

  registerNextCommand(app);

  await app.start(Number(Bun.env.PORT) || 3000);
  console.log("⚡️ Standup Bot running with Bun!");

  await connectMongoDB();

  await createUserJsonFile(app);
  await sendStandupMessage(app);

  cron.schedule(
    CronExpression.EVERY_WEEKDAY_AT_10_AM,
    () => sendStandupMessage(app),
    {
      timezone: "Asia/Kolkata",
    }
  );

  console.log("Cron job scheduled for weekday standup at 10 AM (Mon-Fri)");
}

main().catch(console.error);
