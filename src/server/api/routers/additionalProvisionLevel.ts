import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";


export const additionalProvisionLevelRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) =>
    ctx.db.additionalProvisionLevel.findMany()
  ),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.additionalProvisionLevel.findUnique({ where: { id: input.id } })
    ),

  create: publicProcedure
    .input(
      z.object({
        delayPeriod: z.string(),
        initialDeadline: z.number(),
        finalDeadline: z.number(),
        percentageC1: z.number(),
        percentageC2: z.number(),
        percentageC3: z.number(),
        percentageC4: z.number(),
        percentageC5: z.number(),
      })
    )
    .mutation(({ ctx, input }) =>
      ctx.db.additionalProvisionLevel.create({ data: input })
    ),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        delayPeriod: z.string().optional(),
        initialDeadline: z.number().optional(),
        finalDeadline: z.number().optional(),
        percentageC1: z.number().optional(),
        percentageC2: z.number().optional(),
        percentageC3: z.number().optional(),
        percentageC4: z.number().optional(),
        percentageC5: z.number().optional(),
      })
    )
    .mutation(({ ctx, input }) =>
      ctx.db.additionalProvisionLevel.update({
        where: { id: input.id },
        data: {
          delayPeriod: input.delayPeriod,
          initialDeadline: input.initialDeadline,
          finalDeadline: input.finalDeadline,
          percentageC1: input.percentageC1,
          percentageC2: input.percentageC2,
          percentageC3: input.percentageC3,
          percentageC4: input.percentageC4,
          percentageC5: input.percentageC5,
        },
      })
    ),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.additionalProvisionLevel.delete({ where: { id: input.id } })
    ),
});
