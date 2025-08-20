
export type User = {
  id: string;
  name: string;
};

export type StandupDB = {
  lastIndex: number;
  team: User[];
  history: Record<string, string>;
};