"use client";

import { useSession } from "next-auth/react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PastaFuncional, Envelope } from "@prisma/client";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Schema de validação para PastaFuncional (sem userId)
const pastaFuncionalSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(1, "Nome é obrigatório"),
  matricula: z.string().min(1, "Matrícula é obrigatória"),
  observacao: z.string().min(1, "Observação é obrigatória"),
  envelopeId: z.coerce.number().min(1, "Envelope é obrigatório"),
});

export default function PastaFuncionalCreateUpdate({
  data,
  onSuccess,
  envelopes,
}: {
  data: PastaFuncional | null;
  onSuccess?: () => void;
  envelopes: Envelope[];
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const form = useForm<z.infer<typeof pastaFuncionalSchema>>({
    resolver: zodResolver(pastaFuncionalSchema),
    defaultValues: {
      id: data?.id,
      nome: data?.nome ?? "",
      matricula: data?.matricula ?? "",
      observacao: data?.observacao ?? "",
      envelopeId: data?.envelopeId ?? undefined,
    },
  });

  // Mutation para criar PastaFuncional
  const createRecord = api.pastaFuncional.createPastaFuncional.useMutation({
    onSuccess() {
      form.reset();
      onSuccess?.();
      toast.success("GETT-HELP-DESK", {
        description: "Pasta Funcional salva com sucesso",
        position: "bottom-right",
      });
      router.refresh();
    },
    onError(error) {
      console.error("Erro ao criar pasta funcional.", error.message);
      toast.error(`Erro ao criar pasta funcional: ${error.message}`);
    },
  });

  // Mutation para atualizar PastaFuncional
  const updateRecord = api.pastaFuncional.updatePastaFuncional.useMutation({
    onSuccess() {
      form.reset();
      onSuccess?.();
      toast.success("GETT-HELP-DESK", {
        description: "Pasta Funcional atualizada com sucesso",
        position: "bottom-right",
      });
      router.refresh();
    },
    onError(error) {
      console.error("Erro ao atualizar pasta funcional.", error.message);
      toast.error(`Erro ao atualizar pasta funcional: ${error.message}`);
    },
  });

  const onSubmit = async (formData: z.infer<typeof pastaFuncionalSchema>) => {
    if (!userId) {
      toast.error("Usuário não autenticado.");
      return;
    }

    const payload = {
      ...formData,
      userId, // adiciona o userId do usuário logado aqui
    };

    try {
      if (data?.id) {
        await updateRecord.mutateAsync({
          ...payload,
          id: formData.id!,
        });
      } else {
        await createRecord.mutateAsync(payload);
      }
    } catch (error) {
      console.error("Erro ao salvar pasta funcional:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Nome */}
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Matrícula */}
        <FormField
          control={form.control}
          name="matricula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Matrícula</FormLabel>
              <FormControl>
                <Input placeholder="Matrícula" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Observação */}
        <FormField
          control={form.control}
          name="observacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observação</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Observação"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Envelope */}
        <FormField
          control={form.control}
          name="envelopeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Envelope</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                value={field.value?.toString() ?? ""}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um envelope" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {envelopes
                    .filter((env) => env.id !== null && env.id !== undefined && env.id !== 0)
                    .map((env) => (
                      <SelectItem key={env.id} value={env.id.toString()}>
                        {env.descricao}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botão de Submissão */}
        <Button type="submit" className="w-full">
          {data ? "Atualizar" : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}