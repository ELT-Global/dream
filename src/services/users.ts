import { write } from "bun";
import type { User } from "../types";

import type { App } from "@slack/bolt";

export async function getUsers(app: App): Promise<void> {
  const usersList = await app.client.users.list({});

  const members = usersList.members?.filter(
    (u: any) => !u.is_bot && u.id !== "USLACKBOT" && !u.deleted
  );

  const team: User[] = members?.map((m: any) => ({
    id: m.id!,
    name: m.profile?.real_name || m.name || "Unknown",
  })) || [];

  await write("users.json", JSON.stringify(team, null, 2));
}
