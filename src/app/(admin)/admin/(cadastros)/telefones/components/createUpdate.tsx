
"use client";

import GenericForm from "@/components/GenericForm";
import { api } from "@/trpc/react";
import { Telefone, Setor } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const telefoneSchema = z.object({
  id: z.string().nullable(),
  setor_id: z.coerce.number().min(1, "Setor é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  patrimonio: z.string().optional(),
  ramal: z.string().optional(),
  complemento: z.string().optional(),
});

export default function TelefoneCreateUpdate({ 
  data, 
  onSuccess,
  setores
}: { 
  data: Telefone | null, 
  onSuccess?: () => void,
  setores: Setor[]
}) {
  const router = useRouter();

  const createRecord = api.telefone.create.useMutation({
    onSuccess() {
      toast.success("GETT-HELP-DESK", {
        description: "Registro salvo com sucesso",
        position: 'bottom-right'
      }) 
      onSuccess?.();
      router.refresh();
    },
    onError(error) {
      console.error('Erro interno.', error.message);
      alert(`Erro ao criar telefone: ${error.message}`);
    }
  });

  const updateRecord = api.telefone.update.useMutation({
    onSuccess() {
      toast.success("GETT-HELP-DESK", {
        description: "Registro salvo com sucesso",
        position: 'bottom-right'
      }) 
      onSuccess?.();
      router.refresh();
    },
    onError(error) {
      console.error('Erro interno.', error.message);
      alert(`Erro ao atualizar telefone: ${error.message}`);
    }
  });

  const onSubmit = async (dataForm: z.infer<typeof telefoneSchema>) => {
    if (dataForm.id) {
      await updateRecord.mutateAsync({
        ...dataForm,
        id: parseInt(dataForm.id)
      });
    } else {
      await createRecord.mutateAsync({
        ...dataForm
      });
    }
  };

  return (
    <div>
      <GenericForm
        schema={telefoneSchema}
        onSubmit={onSubmit}
        defaultValues={{
          id: data?.id.toString() ?? '',
          setor_id: data?.setor_id ?? '',
          responsavel: data?.responsavel ?? '',
          patrimonio: data?.patrimonio ?? '',
          ramal: data?.ramal ?? '',
          complemento: data?.complemento ?? '',
        }}
        fields={{
          id: { label: "ID", type: "hidden" },
          setor_id: { 
            label: "Setor", 
            type: "select", 
            options: setores?.map(setor => ({ 
              value: setor.id.toString(), 
              label: setor.sigla 
            }))
          },
          responsavel: { label: "Responsável", type: "text", placeholder: "Nome do responsável" },
          patrimonio: { label: "Patrimônio", type: "text", placeholder: "Número do patrimônio", optional: true },
          ramal: { label: "Ramal", type: "text", placeholder: "Número do ramal", optional: true },
          complemento: { label: "Complemento", type: "text", placeholder: "Informações adicionais", optional: true },
        }}
        submitLabel={data ? 'Atualizar' : 'Salvar'}
      />
    </div>
  );
}
