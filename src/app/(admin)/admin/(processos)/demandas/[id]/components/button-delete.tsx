"use client";

import {  useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { PassiveRestructuring } from "@prisma/client";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";


export default function ButtonDelete({
  data,
  onSuccess,
}: {
  data: PassiveRestructuring | null;
  onSuccess?: () => void;
}) {
  const router = useRouter();

  // Setup do formulário com valores padrão (defaultValues)
  const form = useForm();

  const deleteRecord = api.passiveRestructuring.delete.useMutation({
    onSuccess(deletedRecord) {
      toast.success("Registro excluído com sucesso");
      onSuccess?.();
      router.refresh();
    },
    onError(error) {
      console.error("Erro detalhado:", error);
      toast.error(error.message || "Erro ao excluir registro");
    }
  });

  // Função de submissão
  const onSubmit = async () => {
    if (!data?.id) {
      toast.error("ID do registro não encontrado");
      return;
    }

    toast.warning("Confirma a exclusão?", {  
      description: "Esta ação removerá o registro e não será possível sua recuperação.",  
      position: "top-center",  
      duration: 10000, // 10 seconds  
      cancel: {  
        label: "Cancelar",  
        onClick: () => {  
          // Do nothing if cancelled  
          toast.dismiss();  
        }  
      },  
      action: {  
        label: "Confirmar",  
        onClick: async () => await deleteRecord.mutateAsync({ id: data.id })
      }  
    }); 
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Button type="submit" variant={'destructive'}>
          <Trash className="w-4 h-4" />
        </Button>
      </form>
    </Form>
  );
}