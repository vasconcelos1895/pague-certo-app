import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const demandRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.demand.findMany({
      include: {
        PassiveRestructuring: true,
        client: true,
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.demand.findUnique({
        where: { id: input.id },
        include: {
          PassiveRestructuring: true,
          client: true,
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        clientId: z.string().uuid(),
        responsible: z.string(),
        priority: z.enum(["ALTA", "MEDIA", "BAIXA"]).default("BAIXA"),
        notes: z.string().optional(),
        status: z
          .enum([
            "NAO_INICIADO",
            "EM_ANDAMENTO",
            "CONCLUIDO",
            "SUSPENSO",
            "CANCELADO",
          ])
          .default("NAO_INICIADO"),        
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.demand.create({
        data: input,
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        responsible: z.string().optional(),
        priority: z.enum(["ALTA", "MEDIA", "BAIXA"]).optional(),
        notes: z.string().optional(),
        status: z
          .enum([
            "NAO_INICIADO",
            "EM_ANDAMENTO",
            "CONCLUIDO",
            "SUSPENSO",
            "CANCELADO",
          ])
          .default("NAO_INICIADO"),        
      })
    )
    .mutation(({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.demand.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.demand.delete({
        where: { id: input.id },
      });
    }),
});