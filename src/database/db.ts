import { file, write } from "bun";
import type { StandupDB } from "../types";

const dbPath = `${import.meta.dir}/../../standup.json`;

export async function loadDB(): Promise<StandupDB> {
  try {
    const f = file(dbPath);
    if (!(await f.exists())) {
      throw new Error(
        `Database file ${dbPath} does not exist. Please ensure standup.json exists with team members defined.`
      );
    }
    const data = await f.json();

    // Validate that team array exists and is not empty
    if (!data.team || !Array.isArray(data.team) || data.team.length === 0) {
      throw new Error(
        "Team array is missing or empty in standup.json. Please add team members to the 'team' field."
      );
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to load database: ${error}`);
  }
}

export async function saveDB(db: StandupDB): Promise<void> {
  await write(dbPath, JSON.stringify(db, null, 2));
}
