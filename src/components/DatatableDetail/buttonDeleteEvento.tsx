"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { toast } from "sonner";
import type { EventoNomeacao } from "@prisma/client";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";


export default function ButtonDeleteEvento({
  data,
  onSuccess,
}: {
  data: EventoNomeacao | null;
  onSuccess?: () => void;
}) {
  const router = useRouter();

  // Setup do formulário com valores padrão (defaultValues)
  const form = useForm();

  // Mutation para criar registro
  const deleteRecord = api.eventoNomeacao.delete.useMutation({
    onSuccess() {
      form.reset();
      onSuccess?.();
      toast.success("Registro excluído com sucesso", {
        position: "bottom-right",
      });
      router.refresh();
    },
    onError(error) {
      console.error("Erro ao excluir registro.", error.message);
      toast.error("Erro ao excluir registro");
    },
  });

  // Função de submissão
  const onSubmit = async () => {
    try {
      if (data?.id) {
        await deleteRecord.mutateAsync({
          id: data.id,
        });
      } 
    } catch (error) {
      console.error("Erro ao excluir registro.", error);
      toast.error("Erro ao excluir registro.");
    }
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