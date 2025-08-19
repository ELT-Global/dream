import { App } from "@slack/bolt";
import { file, write } from "bun";

// --- Team & DB setup ---
const dbPath = `${import.meta.dir}/../standup.json`;

type StandupDB = {
  lastIndex: number;
  team: string[];
  history: Record<string, string>;
};

async function loadDB(): Promise<StandupDB> {
  try {
    const f = file(dbPath);
    if (!(await f.exists())) {
      throw new Error(`Database file ${dbPath} does not exist. Please ensure standup.json exists with team members defined.`);
    }
    const data = await f.json();
    
    // Validate that team array exists and is not empty
    if (!data.team || !Array.isArray(data.team) || data.team.length === 0) {
      throw new Error("Team array is missing or empty in standup.json. Please add team members to the 'team' field.");
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to load database: ${error}`);
  }
}

async function saveDB(db: StandupDB) {
  await write(dbPath, JSON.stringify(db, null, 2));
}

function getTodayKey(): string {
  const dateString = new Date().toISOString().split("T")[0];
  if (!dateString) {
    throw new Error("Failed to generate date string");
  }
  return dateString;
}

async function getTodayLeader(): Promise<string> {
  const db = await loadDB();
  const today = getTodayKey();

  if (db.history[today]) return db.history[today];

  const nextIndex = (db.lastIndex + 1) % db.team.length;
  const leader = db.team[nextIndex];
  
  if (!leader) {
    throw new Error(`No team member found at index ${nextIndex}`);
  }

  db.lastIndex = nextIndex;
  db.history[today] = leader;
  await saveDB(db);

  return leader;
}

// --- Slack app ---
const app = new App({
  token: Bun.env.SLACK_BOT_TOKEN,
  signingSecret: Bun.env.SLACK_SIGNING_SECRET,
});

const leader = await getTodayLeader();

await app.start(Number(Bun.env.PORT) || 3000);
console.log("⚡️ Standup Bot running with Bun!");
await app.client.chat.postMessage({
  channel: Bun.env.SLACK_CHANNEL_ID,
  text: `${leader} is leading today's standup.`,
});
