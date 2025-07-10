
"use client";

import GenericForm from "@/components/GenericForm";
import { api } from "@/trpc/react";
import { Monitor, Setor } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const monitorSchema = z.object({
  id: z.string().nullable(),
  setor_id: z.coerce.number().min(1, "Setor é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  patrimonio: z.string().optional(),
  inventario: z.string().optional(),
  tipo: z.string().min(1, "Tipo é obrigatório"),
  serie: z.string().optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  polegada: z.string().optional(),
  cor: z.string().optional(),
});

export default function CreateUpdate({ 
  data, 
  onSuccess,
  setores
}: { 
  data: Monitor | null, 
  onSuccess?: () => void,
  setores: Setor[]
}) {
  const router = useRouter();

  const createRecord = api.monitor.create.useMutation({
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
      alert(`Erro ao criar monitor: ${error.message}`);
    }
  });

  const updateRecord = api.monitor.update.useMutation({
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
      alert(`Erro ao atualizar monitor: ${error.message}`);
    }
  });

  const onSubmit = async (dataForm: z.infer<typeof monitorSchema>) => {
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
        schema={monitorSchema}
        onSubmit={onSubmit}
        defaultValues={{
          id: data?.id.toString() ?? '',
          setor_id: data?.setor_id ?? '',
          responsavel: data?.responsavel ?? '',
          patrimonio: data?.patrimonio ?? '',
          inventario: data?.inventario ?? '',
          tipo: data?.tipo ?? '',
          serie: data?.serie ?? '',
          marca: data?.marca ?? '',
          modelo: data?.modelo ?? '',
          polegada: data?.polegada ?? '',
          cor: data?.cor ?? '',
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
          patrimonio: { label: "Patrimônio", type: "text", placeholder: "Número do patrimônio" },
          inventario: { label: "Inventário", type: "text", placeholder: "Número do inventário" },
          tipo: { label: "Tipo", type: "text", placeholder: "Tipo de monitor" },
          serie: { label: "Série", type: "text", placeholder: "Número de série", optional: true },
          marca: { label: "Marca", type: "text", placeholder: "Marca do monitor", optional: true },
          modelo: { label: "Modelo", type: "text", placeholder: "Modelo do monitor", optional: true },
          polegada: { label: "Polegada", type: "text", placeholder: "Tamanho da tela", optional: true },
          cor: { label: "Cor", type: "text", placeholder: "Cor do monitor", optional: true },
        }}
        submitLabel={data ? 'Atualizar' : 'Salvar'}
      />
    </div>
  );
}
