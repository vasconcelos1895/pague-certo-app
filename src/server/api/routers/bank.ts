import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const bankRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.bank.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.bank.findUnique({ where: { id: input.id } });
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bank.create({ data: input });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        code: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bank.update({
        where: { id: input.id },
        data: {
          name: input.name,
          code: input.code,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.bank.delete({ where: { id: input.id } });
    }),
});
