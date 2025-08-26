import type { User } from "../types";
import type { App } from "@slack/bolt";
import { Leader, type ILeader } from "../database/leaders.model";

export async function getTodayLeader(): Promise<User> {
  const allLeaders: User[] = await Bun.file("users.json").json();
  if (!Array.isArray(allLeaders) || allLeaders.length === 0) {
    throw new Error("No leaders available in users.json");
  }
  const newLeader = allLeaders[Math.floor(Math.random() * allLeaders.length)];
  const saveLeader: ILeader = new Leader({
    leaderId: newLeader.id,
    name: newLeader.name,
    date: new Date(),
  });
  await saveLeader.save();
  return newLeader;
}

export async function sendStandupMessage(app: App): Promise<void> {
  try {
    const leader = await getTodayLeader();
    const { mentionUser } = await import("../utils/mention-user");

    await app.client.chat.postMessage({
      channel: Bun.env.SLACK_CHANNEL_ID,
      text: `${mentionUser(leader)} is leading today's standup.`,
    });

    console.log(`${leader.name} is leading today's standup.`);
  } catch (error) {
    console.error("Error sending standup message:", error);
  }
}
