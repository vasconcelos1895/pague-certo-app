// import { PrismaClient } from "@prisma/client";

// import { env } from "@/env";

// const createPrismaClient = () =>
//   new PrismaClient({
//     log:
//       env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
//   });

// const globalForPrisma = globalThis as unknown as {
//   prisma: ReturnType<typeof createPrismaClient> | undefined;
// };

// export const db = globalForPrisma.prisma ?? createPrismaClient();

// if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// src/server/db.ts

// Importe ambos os clientes, mas renomeie-os para evitar conflito de nomes
import { PrismaClient as PrismaMySqlClient } from "@prisma/client/mysql";
import { PrismaClient as PrismaPostgresClient } from "@prisma/client/postgres";

import { env } from "@/env"; // Supondo que você tem um arquivo env.ts com as variáveis de ambiente

// Defina qual provedor de banco de dados usar
type DbProvider = "mysql" | "postgresql";

// Pegue o provedor do ambiente. Use um fallback seguro.
const currentDbProvider: DbProvider = (env.DATABASE_PROVIDER || "mysql") as DbProvider;

let prismaClient: PrismaMySqlClient | PrismaPostgresClient;

const createPrismaClient = () => {
  const logConfig = env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"];

  if (currentDbProvider === "mysql") {
    return new PrismaMySqlClient({
      log: logConfig,
      // Outras opções específicas do MySQL, se houver
    });
  } else { // assumed postgresql
    return new PrismaPostgresClient({
      log: logConfig,
      // Outras opções específicas do PostgreSQL, se houver
    });
  }
};

// Use um tipo genérico para globalThis.prisma
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaMySqlClient | PrismaPostgresClient | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;