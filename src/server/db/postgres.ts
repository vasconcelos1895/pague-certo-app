import { PrismaClient as PostgresPrismaClient } from "../../generated/postgres";

declare global {
  var pg: PostgresPrismaClient | undefined;
}

export const pg = global.pg ?? new PostgresPrismaClient();
if (process.env.NODE_ENV !== "production") global.pg = pg;
