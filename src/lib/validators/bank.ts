// lib/validators/bank.ts
import { z } from "zod";

export const bankSchema = z.object({
  name: z
    .string({ required_error: "O nome é obrigatório" })
    .min(2, "O nome deve ter pelo menos 2 caracteres"),
  code: z
    .string({ required_error: "O código é obrigatório" })
    .min(1, "O código não pode ser vazio"),
});

export type BankFormValues = z.infer<typeof bankSchema>;
