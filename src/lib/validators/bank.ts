// lib/validators/bank.ts
import { z } from "zod";

export const bankSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  code: z.string().min(1, "Código é obrigatório"),
});

export type BankFormValues = z.infer<typeof bankSchema>;
