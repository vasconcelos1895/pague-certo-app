import { PrismaClient as MySQLPrismaClient } from "../../generated/mysql";

declare global {
  var mysql: MySQLPrismaClient | undefined;
}

export const mysql = global.mysql ?? new MySQLPrismaClient();
if (process.env.NODE_ENV !== "production") global.mysql = mysql;
