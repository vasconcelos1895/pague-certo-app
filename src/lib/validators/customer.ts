import { z } from "zod";

export const customerSchema = z.object({
  personType: z.enum(["PF", "PJ"]).default("PF"),
  name: z.string().min(2, "Nome é obrigatório"),
  tradeName: z.string().optional(),
  document: z.string().optional(),
  email: z.string().email("E-mail inválido").optional(),
  primaryPhone: z.string().optional(),
  secondaryPhone: z.string().optional(),
  birthDate: z.string().nullable().optional(),
  addressId: z.string().nullable().optional(),
  stateRegistration: z.string().optional(),
  status: z.enum(["ATIVO", "INATIVO", "SUSPENSO"]).default("ATIVO"),
  notes: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

export const addressSchema = z.object({
  clientId: z.string(),
  kind: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().default("BR"),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
