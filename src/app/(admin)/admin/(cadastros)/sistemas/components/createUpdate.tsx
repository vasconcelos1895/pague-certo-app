"use client";

import GenericForm from "@/components/GenericForm";
import { api } from "@/trpc/react";
import { ImpressoraTipo, Setor, Sistema } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";


const defaultSchema = z.object({
  id: z.string().nullable(),  
  descricao: z.string().min(1, "Descrição obrigatório"),
  nome: z.string().min(1, "Nome obrigatório"),
});


export default function CreateUpdate({ data, onSuccess }:{ data:Sistema | null, onSuccess?: () => void}) {
  const router = useRouter();

  const createRecord = api.sistema.create.useMutation({
    onSuccess() {
      toast.success("GETT-HELP-DESK", {
        description: "Registro salvo com sucesso",
        position: 'bottom-right'
      }) 
      onSuccess?.();
      router.refresh()
    },
    onError( error ) {
      console.log('Erro interno.',error.message)
    }
  }); 

  const updateRecord = api.sistema.update.useMutation({
    onSuccess() {
      toast.success("GETT-HELP-DESK", {
        description: "Registro salvo com sucesso",
        position: 'bottom-right'
      }) 
      onSuccess?.();
      router.refresh()
    },
    onError( error ) {
      console.log('Erro interno.',error.message)
    }
  }); 


  const onSubmit = async (dataForm: z.infer<typeof defaultSchema>) => {
    if (dataForm.id) {
      await updateRecord.mutateAsync({
        ...dataForm,
        id: dataForm.id
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
        schema={defaultSchema}
        onSubmit={onSubmit}
        defaultValues= {{
          id: data?.original?.id.toString() ?? '',       
          descricao: data?.original?.descricao ?? '',
          nome: data?.original?.nome ?? '',
        }}
        fields={{
          id: { label: "ID", type: "hidden", placeholder: "id" },          
          nome: { label: "Nome", type: "text", placeholder: "Ex: SEI" },         
          descricao: { label: "Descrição", type: "text", placeholder: "Ex: Sistema Eletrônico de..." },
        }}
        submitLabel={data ? 'Atualizar' : 'Salvar'}
      />
    </div>
  );
}