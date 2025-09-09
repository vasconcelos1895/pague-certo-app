"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { toast } from "sonner";
import type { PassiveRestructuring } from "@prisma/client";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { FormTextarea } from "@/components/FormTextarea";
import { FormInput } from "@/components/FormInput";
import { FormSelect } from "@/components/FormSelect";
import { passiveRestructuringSchema } from "@/lib/validators/passiveRestructuring";
import FormInputNumber from "@/components/FormInputNumber";
import { Loader2 } from "lucide-react";

// Schema de validação para Estrutura
export default function CrudForm({
  data,
  demandId,
  onSuccess,
}: {
  data: PassiveRestructuring | null;
  demandId: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();

  // Buscar todos os órgãos
  const { data: banks, isLoading: isLoadingBanks } = api.bank.list.useQuery();
  const { data: operations, isLoading: isLoadingOperations } = api.operation.list.useQuery();
  const { data: recoveryTypes, isLoading: isLoadingRecoveryTypes } = api.recoveryType.list.useQuery();


  // Setup do formulário com valores padrão (defaultValues)
  const form = useForm<z.infer<typeof passiveRestructuringSchema>>({
    resolver: zodResolver(passiveRestructuringSchema),
    defaultValues: {
        demandId: data?.demandId ?? "",
        bankId: data?.bankId ?? "",
        operationId: data?.operationId ?? "",
        recoveryTypeId: data?.recoveryTypeId ?? "",
        debtAmount: data?.debtAmount?.toString() ?? 0,
        financialBalance: data?.financialBalance.toString() ?? 0,
        lastPayment: data?.lastPayment ? new Date(data.lastPayment).toISOString() : "",
        settlementProposal: data?.settlementProposal ?? "",
        finalAgreement: data?.finalAgreement ?? "",
        installments: data?.installments.toString() ?? "0",
        authority: data?.authority ?? "",
        office: data?.office ?? "",
        Note: data?.Note ?? "",
        completionDate: data?.completionDate ?? ""  ,
        status: data?.status ?? "NAO_INICIADO" as const,        
    }
  });

  // Mutations para create e update
  const createRecord = api.passiveRestructuring.create.useMutation({
    onSuccess() {
      form.reset();
      onSuccess?.();
      toast.success("Registro salvo com sucesso");
      router.refresh();
    },
    onError(error) {
      console.error("Erro ao criar registro.", error.message);
      toast.error("Erro ao criar registro");
    },
  });

  const updateRecord = api.passiveRestructuring.update.useMutation({
    onSuccess() {
      form.reset();
      onSuccess?.();
      toast.success("Registro atualizada com sucesso");
      router.refresh();
    },
    onError(error) {
      console.error("Erro ao atualizar registro.", error.message);
      toast.error("Erro ao atualizar registro");
    },
  });

  const onSubmit = async (formData: z.infer<typeof passiveRestructuringSchema>) => {
    try {
      const payload = {
          ...formData,
          demandId: demandId,
          lastPayment: formData.lastPayment ? new Date(formData.lastPayment) : undefined,   
          debtAmount: formData.debtAmount ? Number(formData.debtAmount) : 0,
          financialBalance: formData.financialBalance ? Number(formData.financialBalance) : 0,      
          installments: formData.installments ? Number(formData.installments) : 0,            
          settlementProposal: formData.settlementProposal ? Number(formData.settlementProposal) : 0,      
          finalAgreement: formData.finalAgreement ? Number(formData.finalAgreement) : 0,                      
          completionDate: formData.completionDate ? new Date(formData.completionDate) : undefined,          
      }

      if (data?.id) {
        await updateRecord.mutateAsync({
          ...payload,
          id: data.id,
        });
      } else {
        await createRecord.mutateAsync(payload);
      }
    } catch (error) {
      console.error("Erro ao salvar estrutura:", error);
      toast.error("Erro ao salvar estrutura");
    }
  };

  if (isLoadingBanks || isLoadingOperations || isLoadingRecoveryTypes) {
    return <div className="text-center gap-2"><Loader2 className="h-6 w-6 animate-spin text-zinc-600 mb-4" />Carregando ...</div>;
  }  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-3">

        {recoveryTypes?.length > 0 && (
            <FormSelect
              name="bankId"
              label="Banco"
              control={form.control}
              options={banks.map((b) => ({ value: b.id, label: b.name }))}
            />
            
        )}

        {/* Operação */}
        {recoveryTypes?.length > 0 && (
            <FormSelect
            name="operationId"
            label="Operação"
            control={form.control}
            options={operations.map((o) => ({ value: o.id, label: o.name }))}
            />            
        )}

        {/* Valores financeiros */}
        <FormInputNumber name="debtAmount" label="Valor da Dívida" type="number" control={form.control} />
        <FormInputNumber name="financialBalance" label="Saldo Contábil" type="number" control={form.control} />        

        {/* Datas */}
        <FormInput name="lastPayment" label="Último Pagamento" type="date" control={form.control} />        

        {/* Atrasos e provisões */}
        {/**
        <FormInput name="daysLate" label="Dias em Atraso" type="number" control={form.control} /> {/**calcualdo --  hj - lastPayment em dias
        <FormInput name="monthsLate" label="Meses em Atraso" type="number" control={form.control} /> {/**calcualdo --  hj - lastPayment em meses
        */}

        {/* Tipo de Recuperação */}
        {recoveryTypes?.length  > 0 && (
            <FormSelect
            name="recoveryTypeId"
            label="Tipo de Recuperação"
            control={form.control}
            options={recoveryTypes.map((r) => ({ value: r.id, label: r.name }))}
            />            
        )}


        {/* <FormInput name="provisioning" label="Provisão" type="number" control={form.control} /> calculado -- buscar valor classificação e achar correspondente na tabela 
        <FormInput name="amountProvisionedBank" label="Valor Provisionado pelo Banco" type="number" control={form.control} /> calculado -- valor da dívida * provisioning (%) */}

        {/* Perda Gerada -- calculado - se provisioning >= 1 ? "SIM" : "NÃO" */}
        {/* <FormSelect
          name="generatedLoss"
          label="Perda Gerada"
          control={form.control}
          options={[
            { value: "NAO", label: "Não" },
            { value: "SIM", label: "Sim" },
          ]}
        /> */}

        {/* Propostas e acordos */}
        <FormInput name="settlementProposal" label="Proposta de Acordo" type="number" control={form.control} />
        <FormInput name="finalAgreement" label="Acordo Final" type="number" control={form.control} />
        {/* <FormInput name="paymentPlan" label="Plano de Pagamento" type="number" control={form.control} /> --CALCULADO -- debitAmount -  amountProvisionedBank*/}
        <FormInput name="installments" label="Parcelas" type="number" control={form.control} />

        {/* Escritório / Autoridade */}
        <FormInput name="authority" label="Alçada" type="text" control={form.control} />
        <FormInput name="office" label="Escritório" type="text" control={form.control} />
        {/* <FormInput name="timeInOffice" label="Tempo no Escritório" type="text" control={form.control} /> --CALCULADO - Hoje - dataEntrada: por extenso */}

        {/* Benefícios / taxas */}
        {/* <FormInput name="debtReduction" label="Redução da Dívida" type="number" control={form.control} /> --CALCULADO - em percentual */}
        {/* <FormInput name="economicBenefit" label="Benefício Econômico" type="number" control={form.control} /> --CALCULADO - em valores */}
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

        <FormInput name="completionDate" label="Data de Conclusão" type="date" control={form.control} />        

        {/* Observações */}
        <FormTextarea
          name="Note"
          label="Observações"
          placeholder="Digite observações (opcional)"
          control={form.control}
        />

        <Button type="submit" className="w-full" disabled={createRecord.isLoading || updateRecord.isLoading}>
          {data ? "Atualizar" : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}