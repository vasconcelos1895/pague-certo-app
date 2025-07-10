import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const pastaFuncionalRouter = createTRPCRouter({

  createPastaFuncional: publicProcedure
    .input(
      z.object({
        nome: z.string(),
        matricula: z.string(),
        observacao: z.string(),
        envelopeId: z.number(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.pastaFuncional.create({
          data: {
            nome: input.nome,
            matricula: input.matricula,
            observacao: input.observacao,
            envelopeId: input.envelopeId, // <== Incluído
            userId: input.userId,
          },
        });
      } catch (error) {
        console.error("Erro ao criar pasta funcional:", error);
        throw new Error("Não foi possível criar a pasta funcional");
      }
    }),

  updatePastaFuncional: publicProcedure
    .input(
      z.object({
        id: z.number(),
        nome: z.string(),
        matricula: z.string(),
        observacao: z.string(),
        envelopeId: z.number(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.pastaFuncional.update({
          where: { id: input.id },
          data: {
            nome: input.nome,
            matricula: input.matricula,
            observacao: input.observacao,
            envelopeId: input.envelopeId, // <== Incluído
            userId: input.userId,
          },
        });
      } catch (error) {
        console.error("Erro ao atualizar pasta funcional:", error);
        throw new Error("Não foi possível atualizar a pasta funcional");
      }
    }),

  deletePastaFuncional: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.pastaFuncional.delete({
          where: { id: input.id },
        });
        return { success: true };
      } catch (error) {
        console.error("Erro ao deletar pasta funcional:", error);
        throw new Error("Não foi possível deletar a pasta funcional");
      }
    }),

  getPastaFuncionalById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const pasta = await ctx.db.pastaFuncional.findUnique({
        where: { id: input.id },
        include: {
          user: true, // incluir dados do user relacionado
        },
      });
      return pasta ?? null;
    }),

  getPastasFuncionais: protectedProcedure.query(async ({ ctx }) => {
    const pastas = await ctx.db.pastaFuncional.findMany({
      orderBy: { nome: "asc" },
      include: {
        user: true,
        envelope: true,
      },
    });
    return pastas;
  }),

});
