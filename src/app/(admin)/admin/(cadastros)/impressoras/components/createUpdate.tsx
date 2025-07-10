
"use client";

import GenericForm from "@/components/GenericForm";
import { api } from "@/trpc/react";
import { Impressora, ImpressoraTipo, Setor } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const impressoraSchema = z.object({
  id: z.string().nullable(),
  setor_id: z.coerce.number().min(1, "Setor é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  impressora_tipo_id: z.coerce.number().min(1, "Tipo de impressora é obrigatório"),
  serie: z.string().optional(),
  mac: z.string().optional(),
  ip: z.string().optional(),
  mascara: z.string().optional(),
  gateway: z.string().optional(),
});

export default function ImpressoraCreateUpdate({ 
  data, 
  onSuccess,
  setores,
  tiposImpressoras
}: { 
  data: Impressora | null, 
  onSuccess?: () => void,
  setores: Setor[],
  tiposImpressoras: ImpressoraTipo[]
}) {
  const router = useRouter();

  const createRecord = api.impressora.create.useMutation({
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
      alert(`Erro ao criar impressora: ${error.message}`);
    }
  });

  const updateRecord = api.impressora.update.useMutation({
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
      alert(`Erro ao atualizar impressora: ${error.message}`);
    }
  });

  const onSubmit = async (dataForm: z.infer<typeof impressoraSchema>) => {
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

  console.log('setores e impressoras',setores,tiposImpressoras)

  return (
    <div>
      <GenericForm
        schema={impressoraSchema}
        onSubmit={onSubmit}
        defaultValues={{
          id: data?.id.toString() ?? '',
          setor_id: data?.setor_id ?? '',
          responsavel: data?.responsavel ?? '',
          impressora_tipo_id: data?.impressora_tipo_id ?? '',
          serie: data?.serie ?? '',
          mac: data?.mac ?? '',
          ip: data?.ip ?? '',
          mascara: data?.mascara ?? '',
          gateway: data?.gateway ?? '',
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
          impressora_tipo_id: { 
            label: "Tipo de Impressora", 
            type: "select", 
            options: tiposImpressoras?.map(tipo => ({ 
              value: tipo.id.toString(), 
              label: tipo.descricao 
            }))
          },
          serie: { label: "Série", type: "text", placeholder: "Número de série", optional: true },
          mac: { label: "Endereço MAC", type: "text", placeholder: "Endereço MAC", optional: true },
          ip: { label: "Endereço IP", type: "text", placeholder: "Endereço IP", optional: true },
          mascara: { label: "Máscara de Subrede", type: "text", placeholder: "Máscara de Subrede", optional: true },
          gateway: { label: "Gateway", type: "text", placeholder: "Gateway", optional: true },
        }}
        submitLabel={data ? 'Atualizar' : 'Salvar'}
      />
    </div>
  );
}
