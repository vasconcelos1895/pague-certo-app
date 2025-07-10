"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ButtonDelete({ id }: { id: number }) {
  const router = useRouter();    
  // Mutation para criar registro  
  const deleteRecord = api.interno.delete.useMutation({  
    onSuccess() {  
      toast.success("GETT-HELP-DESK", {
        description: "Registro excluído com sucesso",
        position: 'bottom-right'
      })             
      router.refresh();  
    },  
    onError(error) {  
      console.error('Erro ao excluir atendimento interno.', error.message);  
    }  
  });  


  const handleSubmit = async () => {
    try {
      await deleteRecord.mutateAsync({ id })

    } catch (error) {
      console.log('error:',error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Button size={'icon'} variant={'secondary'} type="submit" ><Trash className="w-4 h-4"/></Button>
    </form>
  );
}