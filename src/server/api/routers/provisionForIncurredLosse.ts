import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";


export const provisionForIncurredLosseRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) =>
    ctx.db.provisionForIncurredLosse.findMany()
  ),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) =>
      ctx.db.provisionForIncurredLosse.findUnique({ where: { id: input.id } })
    ),

  create: publicProcedure
    .input(
      z.object({
        criteria: z.string(),
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
      ctx.db.provisionForIncurredLosse.create({ data: input })
    ),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        criteria: z.string().optional(),
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
      ctx.db.provisionForIncurredLosse.update({
        where: { id: input.id },
        data: {
          criteria: input.criteria,
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
      ctx.db.provisionForIncurredLosse.delete({ where: { id: input.id } })
    ),
});