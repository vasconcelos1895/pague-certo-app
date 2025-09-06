// lib/validators/bank.ts
import { z } from "zod";

export const demandSchema = z.object({
  clientId: z.string().uuid(),
  responsible: z.string().min(3, "Mínimo 3 caracteres"),
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
});

export type DemandFormValues = z.infer<typeof demandSchema>;
