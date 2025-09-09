import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const passiveRestructuringRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => ctx.db.passiveRestructuring.findMany({
      include: {
        demand: true,
        bank: true,
        operation: true,
        recoveryType: true,
      },
    })
  ),

  getById: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.passiveRestructuring.findUnique({
        where: { id: input.id },
        include: {
          demand: true,
          bank: true,
          operation: true,
          recoveryType: true,
        },
      });
    }),


  getByDemandId: protectedProcedure
    .input(z.object({ demandId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.passiveRestructuring.findMany({
        where: { demandId: input.demandId },
        include: {
          demand: true,
          bank: true,
          operation: true,
          recoveryType: true,
        },
      });
    }),    

  create: protectedProcedure
    .input(
      z.object({
        demandId: z.string().uuid(),
        bankId: z.string(),
        operationId: z.string(),
        recoveryTypeId: z.string(),
        debtAmount: z.number().optional(),
        financialBalance: z.number().optional(),
        lastPayment: z.date().optional(),
        daysLate: z.number().optional(),
        monthsLate: z.number().optional(),
        provisioning: z.number().optional(),
        amountProvisionedBank: z.number().optional(),
        generatedLoss: z.enum(["SIM", "NAO"]).default("NAO"),
        settlementProposal: z.number().optional(),
        finalAgreement: z.number().optional(),
        paymentPlan: z.number().optional(),
        installments: z.number().optional(),
        authority: z.string().optional(),
        office: z.string().optional(),
        Note: z.string().optional(),
        completionDate: z.date().optional(),
        timeInOffice: z.string().optional(),
        debtReduction: z.number().optional(),
        economicBenefit: z.number().optional(),
        officeFee: z.number().optional(),
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
      return ctx.db.passiveRestructuring.create({
        data: input,
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        demandId: z.string().uuid(),
        bankId: z.string(),
        operationId: z.string(),
        recoveryTypeId: z.string(),
        debtAmount: z.number().optional(),
        financialBalance: z.number().optional(),
        lastPayment: z.date().optional(),
        daysLate: z.number().optional(),
        monthsLate: z.number().optional(),
        provisioning: z.number().optional(),
        amountProvisionedBank: z.number().optional(),
        generatedLoss: z.enum(["SIM", "NAO"]).default("NAO"),
        settlementProposal: z.number().optional(),
        finalAgreement: z.number().optional(),
        paymentPlan: z.number().optional(),
        installments: z.number().optional(),
        authority: z.string().optional(),
        office: z.string().optional(),
        Note: z.string().optional(),
        completionDate: z.date().optional(),
        timeInOffice: z.string().optional(),
        debtReduction: z.number().optional(),
        economicBenefit: z.number().optional(),
        officeFee: z.number().optional(),
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
      return ctx.db.passiveRestructuring.update({
        where: { id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.passiveRestructuring.delete({
        where: { id: input.id },
      });
    }),
});