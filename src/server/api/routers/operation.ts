import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
export const operationRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => ctx.db.operation.findMany()),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => ctx.db.operation.findUnique({ where: { id: input.id } })),

  create: publicProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
    }))
    .mutation(({ ctx, input }) => ctx.db.operation.create({ data: input })),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(({ ctx, input }) =>
      ctx.db.operation.update({
        where: { id: input.id },
        data: { name: input.name, description: input.description },
      })
    ),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => ctx.db.operation.delete({ where: { id: input.id } })),
});