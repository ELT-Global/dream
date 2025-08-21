export const CronExpression = {
  EVERY_SECOND: "* * * * * *",
  EVERY_5_SECONDS: "*/5 * * * * *",
  EVERY_10_SECONDS: "*/10 * * * * *",
  EVERY_30_SECONDS: "*/30 * * * * *",
  EVERY_MINUTE: "0 * * * * *",
  EVERY_5_MINUTES: "0 */5 * * * *",
  EVERY_10_MINUTES: "0 */10 * * * *",
  EVERY_HOUR: "0 0 * * * *",
  EVERY_DAY_AT_MIDNIGHT: "0 0 0 * * *",
  EVERY_DAY_AT_10_AM: "0 10 * * *",
  EVERY_WEEK: "0 0 0 * * 0",
  EVERY_MONTH: "0 0 0 1 * *",
  EVERY_YEAR: "0 0 0 1 1 *",
} as const;

export type CronExpression =
  (typeof CronExpression)[keyof typeof CronExpression];
