// lib/validators/bank.ts
import { z } from "zod";

export const operationSchema = z.object({
  name: z
    .string({ required_error: "O nome é obrigatório" })
    .min(2, "O nome deve ter pelo menos 2 caracteres"),
  description: z
    .string()
    .optional()
    .nullable(),
});

export type OperationFormValues = z.infer<typeof operationSchema>;
