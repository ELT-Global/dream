import type { User } from "../types";
import type { App } from "@slack/bolt";
import { Leader, type ILeader } from "../database/leaders.model";
import { USERS } from "../constants/users.constant";

export async function getTodayLeader(): Promise<User> {
  const allLeaders: User[] = USERS;

  const lastLeader = await Leader.findOne().sort({ date: -1 }).lean().exec();
  const lastLeaderIndex = lastLeader
    ? allLeaders.findIndex((user) => user.id === lastLeader.leaderId)
    : -1;
  if (lastLeaderIndex != -1) {
    const newLeaderIndex = (lastLeaderIndex + 1) % allLeaders.length;
    const newLeader = allLeaders[newLeaderIndex];
    const saveLeader: ILeader = new Leader({
      leaderId: newLeader!.id,
      name: newLeader!.name,
      date: new Date(),
    });
    await saveLeader.save();
    return newLeader!;
  } else {
    const newLeader = allLeaders[0];
    const saveLeader: ILeader = new Leader({
      leaderId: newLeader!.id,
      name: newLeader!.name,
      date: new Date(),
    });
    await saveLeader.save();
    return newLeader!;
  }
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
