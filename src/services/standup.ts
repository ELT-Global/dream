import type { User } from "../types";
import { loadDB, saveDB } from "../database/db";
import { getTodayKey } from "../utils/date";
import type { App } from "@slack/bolt";

export async function getTodayLeader(): Promise<User> {
  const db = await loadDB();
  const today = getTodayKey();

  // Check if we already have a leader for today
  if (db.history[today]) {
    const leaderId = db.history[today];
    const leader = db.team.find((member) => member.id === leaderId);
    if (leader) return leader;
  }

  const nextIndex = (db.lastIndex + 1) % db.team.length;
  const leader = db.team[nextIndex];

  if (!leader) {
    throw new Error(`No team member found at index ${nextIndex}`);
  }

  db.lastIndex = nextIndex;
  db.history[today] = leader.id;
  await saveDB(db);

  return leader;
}

export async function sendStandupMessage(app: App): Promise<void> {
  try {
    const leader = await getTodayLeader();
    const { mentionUser } = await import("../utils");
    
    await app.client.chat.postMessage({
      channel: Bun.env.SLACK_CHANNEL_ID,
      text: `${mentionUser(leader)} is leading today's standup.`,
    });
    
    console.log(`${leader.name} is leading today's standup.`);
  } catch (error) {
    console.error("Error sending standup message:", error);
  }
}
