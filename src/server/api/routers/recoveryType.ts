import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";


export const recoveryTypeRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => ctx.db.recoveryType.findMany()),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.recoveryType.findUnique({ where: { id: input.id } })
    ),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => ctx.db.recoveryType.create({ data: input })),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) =>
      ctx.db.recoveryType.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
        },
      })
    ),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.recoveryType.delete({ where: { id: input.id } })
    ),
});