"use client";

import GenericForm from "@/components/GenericForm";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Setor } from "@prisma/client";
import { error } from "console";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


const setorSchema = z.object({
  id: z.string().nullable(),  
  nome: z.string().min(1, "Nome obrigatório"),
  sigla: z.string().min(1, "Sigla obrigatório"),
  orgao: z.string().min(1, "Órgão obrigatório"),
});

const orgaos = [
    { label: "AGETEC", value: "AGETEC" },
    { label: "IMPCG", value: "IMPCG" },
    { label: "PGM", value: "PGM" },      
    { label: "SEMADI", value: "SEMADI" },
    { label: "SESAU", value: "SESAU" },
    { label: "FUNSAT", value: "FUNSAT" },
    { label: "SEMED", value: "SEMED" },
    { label: "SEMADES", value: "SEMADES" },
    { label: "SAS", value: "SAS" },
    { label: "SEGOV", value: "SEGOV" },
    { label: "SEFAZ", value: "SEFAZ" },
    { label: "SEAR", value: "SEAR" },
    { label: "SEPPE", value: "SEPPE" },
    { label: "SELC", value: "SELC" },
    { label: "SEMU", value: "SEMU" },
    { label: "SEJUV", value: "SEJUV" },
    { label: "SECULT", value: "SECULT" },
    { label: "Casa Civil", value: "Casa Civil" },
    { label: "SESDES", value: "SESDES" },
]

export default function CreateUpdate({ data, onSuccess }:{ data:Setor | null, onSuccess?: () => void}) {
  const router = useRouter();

  const createSetor = api.setor.create.useMutation({
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

  const updateSetor = api.setor.update.useMutation({
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


  const onSubmit = async (dataForm: z.infer<typeof setorSchema>) => {
    if (dataForm.id) {
      await updateSetor.mutateAsync({
        ...dataForm,
        id: dataForm.id,
      });
    } else {
      await createSetor.mutateAsync({
        ...dataForm
      });

    }
  };

  return (
    <div>
      <GenericForm
        schema={setorSchema}
        onSubmit={onSubmit}
        defaultValues= {{
          id: data?.original?.id.toString() ?? '',          
          nome: data?.original?.nome ?? '',
          sigla: data?.original?.sigla ?? '',
          orgao: data?.original?.orgao ?? '',
        }}
        fields={{
          id: { label: "ID", type: "hidden", placeholder: "id" },          
          nome: { label: "Nome", type: "text", placeholder: "Ex:  Gerência de Tecnologia..." },
          sigla: { label: "Sigla", type: "text", placeholder: "Ex: GETT" },
          orgao: { label: "Orgãos", type: "select", options: orgaos },
        }}
        submitLabel={data ? 'Atualizar' : 'Salvar'}
      />
    </div>
  );
}