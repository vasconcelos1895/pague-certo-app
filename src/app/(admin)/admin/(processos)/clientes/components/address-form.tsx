"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/FormInput";
import { Save } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import {
  type AddressFormValues,
  addressSchema,
} from "@/lib/validators/customer";
import { type Address } from "@prisma/client";


export function AddressForm({ address, clientId }: { address: Address | null, clientId: string }) {
  console.log('AddressForm renderizado com clientId:', address);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      clientId: address?.clientId ?? clientId, // será preenchido dinamicamente
      kind: address?.kind ?? "",
      street: address?.street ?? "",
      number: address?.number ?? "",
      complement: address?.complement ?? "",
      neighborhood: address?.neighborhood ?? "",
      city: address?.city ?? "",
      state: address?.state ?? "",
      postal_code: address?.postal_code ?? "",
      country: address?.country ?? "BR",
      id: address?.id ?? null,
    },
  });


  const createAddress = api.address.create.useMutation({
    onSuccess: () => {
      toast.success("Registro criado com sucesso!")      
    },
    onError: (err) => toast.error(`Erro ao criar registro: ${err.message}`),
  });

  const updateAddress = api.address.update.useMutation({
    onSuccess: () => toast.success("Registro atualizado com sucesso!"),
    onError: (err) => toast.error(`Erro ao atualizar registro: ${err.message}`),
  });


  const onSubmit = (values: AddressFormValues) => {
    const payload = { ...values, clientId };

    if (address?.id) {
      updateAddress.mutate({id: address.id, ...payload});
    } else {
      createAddress.mutate(payload);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormInput name="kind" label="Tipo" control={form.control} />
        <FormInput name="street" label="Rua" control={form.control} />
        <FormInput name="number" label="Número" control={form.control} />
        <FormInput name="complement" label="Complemento" control={form.control} />
        <FormInput name="neighborhood" label="Bairro" control={form.control} />
        <FormInput name="city" label="Cidade" control={form.control} />
        <FormInput name="state" label="Estado" control={form.control} />
        <FormInput name="postal_code" label="CEP" control={form.control} />
        <FormInput name="country" label="País" control={form.control} />

        <Button type="submit" variant="secondary" disabled={createAddress.isPending || updateAddress.isPending}>
          <Save className="mr-2 h-4 w-4" />
          {createAddress.isPending || updateAddress.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </FormProvider>
  );
}
