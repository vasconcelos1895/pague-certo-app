import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
export const clientRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) =>
    ctx.db.client.findMany({ include: { address: true } })
  ),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.client.findUnique({
        where: { id: input.id },
        include: { address: true },
      })
    ),

  create: publicProcedure
    .input(
      z.object({
        personType: z.enum(["PF", "PJ"]),
        name: z.string(),
        tradeName: z.string().optional(),
        document: z.string().optional(),
        email: z.string().email().optional(),
        primaryPhone: z.string().optional(),
        secondaryPhone: z.string().optional(),
        birthDate: z.date().optional(),
        stateRegistration: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => ctx.db.client.create({ data: input })),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        tradeName: z.string().optional(),
        email: z.string().optional(),
        status: z.enum(["ATIVO", "INATIVO", "SUSPENSO"]).optional(),
      })
    )
    .mutation(({ ctx, input }) =>
      ctx.db.client.update({
        where: { id: input.id },
        data: input,
      })
    ),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => ctx.db.client.delete({ where: { id: input.id } })),
});