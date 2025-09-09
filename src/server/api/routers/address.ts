import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";


export const addressRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => ctx.db.address.findMany()),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => ctx.db.address.findUnique({ where: { id: input.id } })),

  getByClientId: publicProcedure
    .input(z.object({ clientId: z.string() }))
    .query(({ ctx, input }) => ctx.db.address.findMany({ where: { clientId: input.clientId } })),    

  create: publicProcedure
    .input(
      z.object({
        clientId: z.string().optional(),
        kind: z.string().optional(),
        street: z.string().optional(),
        number: z.string().optional(),
        complement: z.string().optional(),
        neighborhood: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postal_code: z.string().optional(),
        country: z.string().default("BR"),
      })
    )
    .mutation(({ ctx, input }) => ctx.db.address.create({ data: {
      ...input,
      client: {
        connect: { id: input.clientId }
      }
    }})),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        clientId: z.string().optional(),
        kind: z.string().optional(),
        street: z.string().optional(),
        number: z.string().optional(),
        complement: z.string().optional(),
        neighborhood: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postal_code: z.string().optional(),
        country: z.string().default("BR"),
      })
    )
    .mutation(({ ctx, input }) =>
      ctx.db.address.update({ where: { id: input.id }, data: input })
    ),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => ctx.db.address.delete({ where: { id: input.id } })),
});