"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { type CustomerFormValues, customerSchema } from "@/lib/validators/customer";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { type Client } from "@prisma/client";
import { FormSelect } from "@/components/FormSelect";
import { useRouter } from "next/navigation";


function formatDateForInput(dateInput:Date | string | undefined) {  
    if (!dateInput) return null;

    if (typeof dateInput === 'string') {
        // Se for string, extrai os 10 primeiros caracteres (YYYY-MM-DD)
        return dateInput.substring(0, 10);
    }

    if (dateInput instanceof Date) {
        // Se for objeto Date, formata usando UTC para evitar problema de fuso horário
        const year = dateInput.getUTCFullYear();
        const month = String(dateInput.getUTCMonth() + 1).padStart(2, '0');
        const day = String(dateInput.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return null; 
}  

export function ClientForm({ customer }: { customer: Client | null }) {
     const router = useRouter();

    const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      personType: customer?.personType ?? "PF",
      name: customer?.name ?? "",
      email: customer?.email ?? "",
      tradeName: customer?.tradeName ?? "",
      document: customer?.document ?? "",
      email: customer?.email ?? "",
      primaryPhone: customer?.primaryPhone ?? "",
      secondaryPhone: customer?.secondaryPhone ?? "",
      birthDate: customer?.birthDate ? formatDateForInput(customer.birthDate) : null,
      stateRegistration: customer?.stateRegistration ?? "",
      addressId: customer?.addressId ?? "",
      status: customer?.status ?? "ATIVO",
      notes: customer?.notes ?? "",      
    }
  });


  const createClient = api.customer.create.useMutation({
    onSuccess: (data) => {
      toast.success("Registro criado com sucesso!");
      router.push(`/admin/clientes/${data.id}`);
    },
    onError: (err) => toast.error(`Erro ao criar registro: ${err.message}`),
  });

  const updateClient = api.customer.update.useMutation({
    onSuccess: () => toast.success("Registro atualizado com sucesso!"),
    onError: (err) => toast.error(`Erro ao atualizar registro: ${err.message}`),
  });


  const onSubmit = (values: CustomerFormValues) => {
      const payload = {
        ...values,
        birthDate: values.birthDate ? new Date(values.birthDate) : undefined,
        addressId: values.addressId ?? undefined,        
      };    


    if (customer?.id) {
      updateClient.mutate({ id: customer?.id, ...payload });
    } else {
      createClient.mutate(payload);
    }
  };


  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
       {/* Tipo de Pessoa */}
        <FormSelect
          name="personType"
          label="Tipo de Pessoa"
          control={form.control}
          options={[
            { label: "Pessoa Física", value: "PF" },
            { label: "Pessoa Jurídica", value: "PJ" },
          ]}
        />

        <FormInput name="name" label="Nome / Razão Social" control={form.control} />

        {/* Exibir somente se for PJ */}
        {form.watch("personType") === "PJ" && (
          <>
            <FormInput name="tradeName" label="Nome Fantasia" control={form.control} />
            <FormInput name="stateRegistration" label="Inscrição Estadual" control={form.control} />
          </>
        )}

        <FormInput name="document" label="CPF / CNPJ" control={form.control} />
        <FormInput name="email" label="E-mail" control={form.control} />
        <FormInput name="primaryPhone" label="Telefone Principal" control={form.control} />
        <FormInput name="secondaryPhone" label="Telefone Secundário" control={form.control} />

        {/* Exibir somente se for PF */}
        {form.watch("personType") === "PF" && (
          <FormInput name="birthDate" type="date" label="Data de Nascimento" control={form.control} />
        )}

        <FormSelect
          name="status"
          label="Status"
          control={form.control}
          options={[
            { label: "Ativo", value: "ATIVO" },
            { label: "Inativo", value: "INATIVO" },
            { label: "Suspenso", value: "SUSPENSO" },
          ]}
        />

        <FormInput name="notes" label="Observações" control={form.control} />

        <Button type="submit" variant="secondary" disabled={createClient.isPending}>
          <Save className="mr-2 h-4 w-4" />
          {createClient.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </FormProvider>
  );
}
