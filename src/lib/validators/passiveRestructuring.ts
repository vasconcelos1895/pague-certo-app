// lib/validators/bank.ts
import { z } from "zod";

export const passiveRestructuringSchema = z.object({
  bankId: z.string(),
  operationId: z.string(),
  recoveryTypeId: z.string(),
  debtAmount: z.string().optional(),
  financialBalance: z.string().optional(),
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
});

export type PassiveRestructuringFormValues = z.infer<typeof passiveRestructuringSchema>;
