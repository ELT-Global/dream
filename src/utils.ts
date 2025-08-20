import type { User } from "./types";

export const mentionUser = (user: User) => {
  return `<@${user.id}>`;
};
