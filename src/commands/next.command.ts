import type { App } from "@slack/bolt";
import { sendStandupMessage } from "../services/standup";

export function registerNextCommand(app: App) {
  app.command("/next", async ({ command, ack, respond }) => {
    await ack();

    try {
      await sendStandupMessage(app);
      await respond({
        text: "✅ New leader selected",
        response_type: "ephemeral",
      });
    } catch (error) {
      console.error("Error sending standup message:", error);
      await respond({
        text: "❌ Failed to send standup message. Please try again.",
        response_type: "ephemeral",
      });
    }
  });
}
