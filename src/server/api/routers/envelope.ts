import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const envelopeRouter = createTRPCRouter({

  // -------------- Envelope CRUD ----------------

  createEnvelope: publicProcedure
    .input(
      z.object({
        descricao: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Verifica se já existe Envelope com essa descrição
        const existing = await ctx.db.envelope.findFirst({
          where: { descricao: input.descricao },
        });
        if (existing) {
          const error = new Error("Já existe um envelope cadastrado com essa descrição.");
          (error as any).code = "DUPLICATE_DESCRIPTION";
          throw error;
        }

        return await ctx.db.envelope.create({
          data: {
            descricao: input.descricao,
          },
        });
      } catch (error) {
        console.error("Erro ao criar envelope:", error);
      }
    }),

  updateEnvelope: publicProcedure
    .input(
      z.object({
        id: z.number(),
        descricao: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Verifica se já existe Envelope com essa descrição e id diferente
        const existing = await ctx.db.envelope.findFirst({
          where: {
            descricao: input.descricao,
            NOT: { id: input.id },
          },
        });
        if (existing) {
          const error = new Error("Já existe um envelope cadastrado com essa descrição.");
          (error as any).code = "DUPLICATE_DESCRIPTION";
          throw error;
        }

        return await ctx.db.envelope.update({
          where: { id: input.id },
          data: {
            descricao: input.descricao,
          },
        });
      } catch (error) {
        console.error("Erro ao atualizar envelope:", error);
      }
    }),

  deleteEnvelope: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.envelope.delete({
          where: { id: input.id },
        });
        return { success: true };
      } catch (error) {
        console.error("Erro ao deletar envelope:", error);
        throw new Error("Não foi possível deletar o envelope");
      }
    }),

  getEnvelopeById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const envelope = await ctx.db.envelope.findUnique({
        where: { id: input.id },
      });
      return envelope ?? null;
    }),

  getEnvelopes: protectedProcedure.query(async ({ ctx }) => {
    const envelopes = await ctx.db.envelope.findMany({
      orderBy: { descricao: "asc" },
    });
    return envelopes;
  }),


});
