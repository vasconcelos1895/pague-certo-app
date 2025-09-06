"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components/FormInput";
import { type BankFormValues, bankSchema } from "@/lib/validators/bank";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface CrudFormProps {
  defaultValues?: Partial<BankFormValues>;
  onSubmit: (values: BankFormValues) => void;
  isLoading?: boolean;
}

export function CrudForm({ defaultValues, onSubmit, isLoading }: CrudFormProps) {
  const form = useForm<BankFormValues>({
    resolver: zodResolver(bankSchema),
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormInput name="name" label="Nome" control={form.control} />
        <FormInput name="code" label="Código" control={form.control} />

        <Button type="submit" variant={"secondary"} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </FormProvider>
  );
}
