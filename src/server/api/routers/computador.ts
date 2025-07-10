import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const computadorRouter = createTRPCRouter({

  create: publicProcedure
    .input(z.object({
      setor_id: z.number(),
      responsavel: z.string(),
      patrimonio: z.string(),
      inventario: z.string(),
      especificacao: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.computador.create({
          data: {
            setor_id: input.setor_id,
            responsavel: input.responsavel,
            patrimonio: input.patrimonio,
            inventario: input.inventario,
            especificacao: input.especificacao || '',
          },
        });
      } catch (error) {
        console.error("Erro ao criar computador:", error);
        throw new Error("Não foi possível criar o computador");
      }
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      setor_id: z.number(),
      responsavel: z.string(),
      patrimonio: z.string(),
      inventario: z.string(),
      especificacao: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.db.computador.update({
          where: { id: input.id },
          data: {
            setor_id: input.setor_id,
            responsavel: input.responsavel,
            patrimonio: input.patrimonio,
            inventario: input.inventario,
            especificacao: input.especificacao || '',
          },
        });
      } catch (error) {
        console.error("Erro ao atualizar computador:", error);
        throw new Error("Não foi possível atualizar o computador");
      }
    }),


  getComputadores: protectedProcedure.query(async ({ ctx }) => {
    const computadores = await ctx.db.computador.findMany({
      include: {
        setor: true,
        Especificacao: true
      },
      orderBy: { 
        setor: {
          sigla: 'asc'
        }
      },
    });

    return computadores ?? null;
  }),

  getComputadorById: protectedProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ ctx, input }) => {
    const computador = await ctx.db.computador.findUnique({
      where: { id: Number(input.id) },
      include: {
        setor: true,
        Especificacao: true
      }
    })

    return computador ?? null;
  }),  


  getQtdeComputador: protectedProcedure.query(async ({ ctx }) => {
    const computadores = await ctx.db.computador.findMany();

    const qtdeComputadores = computadores.length;

    return qtdeComputadores ?? 0;
  }),

  // Método para buscar computadores por setor e tipo
  getBySetorAndTipo: publicProcedure
    .input(z.object({ 
      setor_id: z.number()
    }))
    .query(async ({ ctx, input }) => {
      const computadores = await ctx.db.computador.findMany({
        where: { 
          setor_id: input.setor_id 
        },
        select: {
          id: true,
          responsavel: true,
          patrimonio: true,
          inventario: true,
        }
      });

      // Mapeia os computadores para um formato consistente
      return computadores.map(comp => ({
        id: comp.id,
        identificador: `${comp.patrimonio} - ${comp.responsavel} ` || `${comp.inventario} - ${comp.responsavel} `,
        patrimonio: comp.patrimonio,
        inventario: comp.inventario,
      }));
    }),


});
