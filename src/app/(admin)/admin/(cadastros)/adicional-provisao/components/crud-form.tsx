"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { type AdditionalProvisionLevelFormValues, additionalProvisionLevelSchema } from "@/lib/validators/additionalProvisionLevel";
import FormInputNumber from "@/components/FormInputNumber";

interface CrudFormProps {
  defaultValues?: Partial<AdditionalProvisionLevelFormValues>;
  onSubmit: (values: AdditionalProvisionLevelFormValues) => void;
  isLoading?: boolean;
}

export function CrudForm({ defaultValues, onSubmit, isLoading }: CrudFormProps) {
  const form = useForm<AdditionalProvisionLevelFormValues>({
    resolver: zodResolver(additionalProvisionLevelSchema),
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormInput name="delayPeriod" label="Período de atraso" control={form.control} />
        <div className="grid grid-cols 1 md:grid-cols-2 gap-3">
          <FormInputNumber name="initialDeadline" label="Prazo Inicial" control={form.control} />
          <FormInputNumber name="finalDeadline" label="Prazo Final" control={form.control} />
        </div>
        <div className="grid grid-cols 1 md:grid-cols-2 lg:grid-cols-5 gap-3">          
          <FormInputNumber name="percentageC1" label="C1 (%)" control={form.control} />
          <FormInputNumber name="percentageC2" label="C2 (%)" control={form.control} />
          <FormInputNumber name="percentageC3" label="C3 (%)" control={form.control} />
          <FormInputNumber name="percentageC4" label="C4 (%)" control={form.control} />
          <FormInputNumber name="percentageC5" label="C5 (%)" control={form.control} />        
        </div>        

        <Button type="submit" variant={"secondary"} disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </FormProvider>
  );
}
