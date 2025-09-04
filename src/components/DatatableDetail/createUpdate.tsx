"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

const eventoNomeacaoSchema = z.object({
  id: z.string().optional(),
  nomeacaoId: z.string().min(1, "Nomeação é obrigatória"),
  descricao: z.string().max(500).optional(),
});

type EventoNomeacaoFormValues = z.infer<typeof eventoNomeacaoSchema>;

export default function CreateUpdate({
  data,
  nomeacaoId,
  onSuccess,
}: {
  data: EventoNomeacaoFormValues | null;
  nomeacaoId: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();

  const form = useForm<EventoNomeacaoFormValues>({
    resolver: zodResolver(eventoNomeacaoSchema),
    defaultValues: {
      id: data?.id,
      nomeacaoId: data?.nomeacaoId ?? nomeacaoId,
      descricao: data?.descricao ?? "",
    },
  });

  const createRecord = api.eventoNomeacao.create.useMutation({
    onSuccess() {
      form.reset({ nomeacaoId }); // Mantém o nomeacaoId
      onSuccess?.();
      toast.success("Evento criado com sucesso", { position: "bottom-right" });
      router.refresh();
    },
    onError(error) {
      console.error("Erro ao criar evento:", error.message);
      toast.error("Erro ao criar evento");
    },
  });

  const updateRecord = api.eventoNomeacao.update.useMutation({
    onSuccess() {
      form.reset({ nomeacaoId });
      onSuccess?.();
      toast.success("Evento atualizado com sucesso", { position: "bottom-right" });
      router.refresh();
    },
    onError(error) {
      console.error("Erro ao atualizar evento:", error.message);
      toast.error("Erro ao atualizar evento");
    },
  });

  const onSubmit = async (formData: EventoNomeacaoFormValues) => {
    try {
      if (data?.id) {
        await updateRecord.mutateAsync(formData);
      } else {
        await createRecord.mutateAsync(formData);
      }
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      toast.error("Erro ao salvar evento");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Descrição */}
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Descrição do Evento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botão submit */}
        <Button
          type="submit"
          disabled={createRecord.isPending || updateRecord.isPending}
          className="w-full"
        >
          {data ? "Atualizar" : "Criar"}
        </Button>
      </form>
    </Form>
  );
}