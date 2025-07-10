"use client";

import GenericForm from "@/components/GenericForm";
import { api } from "@/trpc/react";
import { ImpressoraTipo, Setor } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";


const defaultSchema = z.object({
  id: z.string().nullable(),  
  descricao: z.string().min(1, "Descrição obrigatório"),
  tipo: z.string().min(1, "Tipo obrigatório"),
  valor: z.string().min(1, "Valor obrigatório"),
  franquiaPb: z.string().min(1, "Franquia preto e branco obrigatório"),
  franquiaCl: z.string().min(1, "Franquia colorido obrigatório"),    
});

const modelos = [
    { label: "BROTHER IMP HLL6202DW", value: "BROTHER IMP HLL6202DW" },
    { label: "BROTHER MFC DCPL5652DN", value: "BROTHER MFC DCPL5652DN" },
    { label: "BROTHER MFC L6902DW", value: "BROTHER MFC L6902DW" },
    { label: "XEROX IMP C500DN", value: "XEROX IMP C500DN" },
    { label: "XEROX MFC C8155FMONO", value: "XEROX MFC C8155FMONO" },
]

const tipos = [
  { label: "I", value: "I" },
  { label: "II", value: "II" },
  { label: "III", value: "III" },
  { label: "IV", value: "IV" },
  { label: "V", value: "V" },
]

export default function CreateUpdate({ data, onSuccess }:{ data:ImpressoraTipo | null, onSuccess?: () => void}) {
  const router = useRouter();

  const createRecord = api.tipoImpressora.create.useMutation({
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

  const updateRecord = api.tipoImpressora.update.useMutation({
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
        id: dataForm.id,
        franquiaCl: Number(dataForm.franquiaCl),
        franquiaPb: Number(dataForm.franquiaPb),        
        valor:  Number(dataForm.valor),        
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
          tipo: data?.original?.tipo ?? '',
          valor: data?.original?.valor.toString() ?? '0',
          franquiaPb: data?.original?.franquiaPb.toString() ?? '0',
          franquiaCl: data?.original?.franquiaCl.toString() ?? '0',
        }}
        fields={{
          id: { label: "ID", type: "hidden", placeholder: "id" },          
          descricao: { label: "Descrição", type: "select", options: modelos },
          tipo: { label: "Tipo", type: "select", options: tipos },         
          valor: { label: "Valor (R$)", type: "numericformat", placeholder: "0,00" },           
          franquiaPb: { label: "Franq. (PB)", type: "number" },
          franquiaCl: { label: "Franq. (Col.)", type: "number" },          
        }}
        submitLabel={data ? 'Atualizar' : 'Salvar'}
      />
    </div>
  );
}