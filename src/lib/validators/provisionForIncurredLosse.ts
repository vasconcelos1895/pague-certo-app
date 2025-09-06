
import { z } from "zod";

export const provisionForIncurredLosseSchema = z.object({
  criteria: z.string().min(1, "Obrigatório"),
  initialDeadline: z.string({message:"Campo obrigatório"}),
  finalDeadline: z.string({message:"Campo obrigatório"}),
  percentageC1: z.string({message:"Campo obrigatório"}),
  percentageC2: z.string({message:"Campo obrigatório"}),
  percentageC3: z.string({message:"Campo obrigatório"}),
  percentageC4: z.string({message:"Campo obrigatório"}),
  percentageC5: z.string({message:"Campo obrigatório"}),
});

export type ProvisionForIncurredLosseFormValues = z.infer<typeof provisionForIncurredLosseSchema>;
