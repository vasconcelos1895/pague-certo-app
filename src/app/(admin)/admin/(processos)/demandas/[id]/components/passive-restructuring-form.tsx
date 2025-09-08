"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FormInput } from "@/components/FormInput";
import { FormSelect } from "@/components/FormSelect";
import {
  passiveRestructuringSchema,
  type PassiveRestructuringFormValues,
} from "@/lib/validators/passiveRestructuring";

interface PassiveRestructuringFormProps {
  defaultValues?: Partial<PassiveRestructuringFormValues>;
  onSubmit: (values: PassiveRestructuringFormValues) => void;
  isLoading?: boolean;
  banks: { id: string; name: string }[];
  operations: { id: string; name: string }[];
  recoveryTypes: { id: string; name: string }[];
  demands?: { id: string; name: string }[];
}

export function PassiveRestructuringForm({
  defaultValues,
  onSubmit,
  isLoading,
  banks,
  operations,
  recoveryTypes,
  demands = [],
}: PassiveRestructuringFormProps) {
  const form = useForm<PassiveRestructuringFormValues>({
    resolver: zodResolver(passiveRestructuringSchema),
    defaultValues,
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-3"
      >
        {/* Banco */}
        <FormSelect
          name="bankId"
          label="Banco"
          control={form.control}
          options={banks.map((b) => ({ value: b.id, label: b.name }))}
        />

        {/* Operação */}
        <FormSelect
          name="operationId"
          label="Operação"
          control={form.control}
          options={operations.map((o) => ({ value: o.id, label: o.name }))}
        />

        {/* Tipo de Recuperação */}
        <FormSelect
          name="recoveryTypeId"
          label="Tipo de Recuperação"
          control={form.control}
          options={recoveryTypes.map((r) => ({ value: r.id, label: r.name }))}
        />

        {/* Valores financeiros */}
        <FormInput name="debtAmount" label="Valor da Dívida" type="number" control={form.control} />
        <FormInput name="financialBalance" label="Saldo Financeiro" type="number" control={form.control} />

        {/* Datas */}
        <FormInput name="lastPayment" label="Último Pagamento" type="date" control={form.control} />
        <FormInput name="completionDate" label="Data de Conclusão" type="date" control={form.control} />

        {/* Atrasos e provisões */}
        <FormInput name="daysLate" label="Dias em Atraso" type="number" control={form.control} />
        <FormInput name="monthsLate" label="Meses em Atraso" type="number" control={form.control} />
        <FormInput name="provisioning" label="Provisão" type="number" control={form.control} />
        <FormInput name="amountProvisionedBank" label="Valor Provisionado pelo Banco" type="number" control={form.control} />

        {/* Perda Gerada */}
        <FormSelect
          name="generatedLoss"
          label="Perda Gerada"
          control={form.control}
          options={[
            { value: "NAO", label: "Não" },
            { value: "SIM", label: "Sim" },
          ]}
        />

        {/* Propostas e acordos */}
        <FormInput name="settlementProposal" label="Proposta de Acordo" type="number" control={form.control} />
        <FormInput name="finalAgreement" label="Acordo Final" type="number" control={form.control} />
        <FormInput name="paymentPlan" label="Plano de Pagamento" type="number" control={form.control} />
        <FormInput name="installments" label="Parcelas" type="number" control={form.control} />

        {/* Escritório / Autoridade */}
        <FormInput name="authority" label="Autoridade" type="text" control={form.control} />
        <FormInput name="office" label="Escritório" type="text" control={form.control} />
        <FormInput name="timeInOffice" label="Tempo no Escritório" type="text" control={form.control} />

        {/* Benefícios / taxas */}
        <FormInput name="debtReduction" label="Redução da Dívida" type="number" control={form.control} />
        <FormInput name="economicBenefit" label="Benefício Econômico" type="number" control={form.control} />
        <FormInput name="officeFee" label="Honorário do Escritório" type="number" control={form.control} />

        {/* Status */}
        <FormSelect
          name="status"
          label="Status"
          control={form.control}
          options={[
            { value: "NAO_INICIADO", label: "Não iniciado" },
            { value: "EM_ANDAMENTO", label: "Em andamento" },
            { value: "CONCLUIDO", label: "Concluído" },
            { value: "SUSPENSO", label: "Suspenso" },
            { value: "CANCELADO", label: "Cancelado" },
          ]}
        />

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium mb-1">Observações</label>
          <Textarea
            {...form.register("Note")}
            placeholder="Digite observações (opcional)"
            rows={4}
          />
        </div>

        {/* Botão */}
        <Button type="submit" variant="secondary" disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Salvando..." : "Salvar"}
        </Button>
      </form>
    </FormProvider>
  );
}
