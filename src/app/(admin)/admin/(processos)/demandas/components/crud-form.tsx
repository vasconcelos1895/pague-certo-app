"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormInput } from "@/components/FormInput";
import { FormSelect } from "@/components/FormSelect";
import { type DemandFormValues, demandSchema } from "@/lib/validators/demand";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface CrudFormProps {
  defaultValues?: Partial<DemandFormValues>;
  onSubmit: (values: DemandFormValues) => void;
  isLoading?: boolean;
  clients?: { id: string; name: string }[];
}

export function CrudForm({
  defaultValues,
  onSubmit,
  isLoading,
  clients = [],
}: CrudFormProps) {
  const form = useForm<DemandFormValues>({
    resolver: zodResolver(demandSchema),
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* Cliente */}
        <FormSelect
          name="clientId"
          label="Cliente"
          control={form.control}
          options={clients.map((c) => ({ value: c.id, label: c.name }))}
        />

        {/* Responsável */}
        <FormInput
          name="responsible"
          label="Responsável"
          control={form.control}
          placeholder="Digite o responsável"
        />

        {/* Prioridade */}
        <FormSelect
          name="priority"
          label="Prioridade"
          control={form.control}
          options={[
            { value: "BAIXA", label: "Baixa" },
            { value: "MEDIA", label: "Média" },
            { value: "ALTA", label: "Alta" },
          ]}
        />

        {/* Status */}
        <FormSelect
          name="status"
          label="Status"
          control={form.control}
          options={[
            { value: "NAO_INICIADO", label: "Não iniciado" },
            { value: "EM_ANDAMENTO", label: "Em andamento" },
            { value: "CONCLUIDO", label: "Concluído" },
          ]}
        />

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium mb-1">Observações</label>
          <Textarea
            {...form.register("notes")}
            placeholder="Digite observações (opcional)"
            rows={4}
          />
        </div>

        <Button type="submit" variant="secondary" disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </FormProvider>
  );
}
