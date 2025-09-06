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
        initialDeadline: z.string().transform(v => parseFloat(v)),
        finalDeadline: z.string().transform(v => parseFloat(v)),
        percentageC1: z.string().transform(v => parseFloat(v)),
        percentageC2: z.string().transform(v => parseFloat(v)),
        percentageC3: z.string().transform(v => parseFloat(v)),
        percentageC4: z.string().transform(v => parseFloat(v)),
        percentageC5: z.string().transform(v => parseFloat(v)),
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
        initialDeadline: z.string().transform(v => parseFloat(v)),
        finalDeadline: z.string().transform(v => parseFloat(v)),
        percentageC1: z.string().transform(v => parseFloat(v)),
        percentageC2: z.string().transform(v => parseFloat(v)),
        percentageC3: z.string().transform(v => parseFloat(v)),
        percentageC4: z.string().transform(v => parseFloat(v)),
        percentageC5: z.string().transform(v => parseFloat(v)),
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