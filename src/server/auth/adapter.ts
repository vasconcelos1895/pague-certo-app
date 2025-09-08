import { PrismaAdapter as BaseAdapter } from "@auth/prisma-adapter";
import { db } from "../db";

/**
 * PrismaAdapter já é uma função que recebe um client Prisma
 * Aqui, passamos dinamicamente o db selecionado.
 */
export const PrismaAdapter = BaseAdapter(db);
