"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ptBR } from "date-fns/locale";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

// Schema zod baseado no model DetalhesAta
const detalhesAtaSchema = z.object({
  id: z.number().optional(),
  ata_id: z.number({
    required_error: "ID da Ata é obrigatório",
  }),
  data: z.date(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
});

type DetalhesAtaForm = z.infer<typeof detalhesAtaSchema>;

export default function DetalhesAtaCreateUpdate({
  data,
  onSuccess,
  ataId, // id da ata pai, obrigatório para criação
}: {
  data: DetalhesAtaForm | null;
  onSuccess?: () => void;
  ataId?: number;
}) {
  const router = useRouter();

  const form = useForm<DetalhesAtaForm>({
    resolver: zodResolver(detalhesAtaSchema),
    defaultValues: {
      id: data?.id,
      ata_id: data?.ata_id ?? ataId ?? 0,  // caso para criação deve receber via prop ataId
      data: data?.data ? new Date(data.data) : new Date(),
      descricao: data?.descricao ?? "",
    },
  });

  const createRecord = api.detalhesAta.create.useMutation({
    onSuccess() {
      form.reset();
      onSuccess?.();
      toast.success("Detalhe da Ata criado com sucesso!", { position: "bottom-right" });
      router.refresh();
    },
    onError(error) {
      console.error("Erro ao criar Detalhe da Ata:", error.message);
      toast.error("Erro ao criar Detalhe da Ata");
    },
  });

  const updateRecord = api.detalhesAta.update.useMutation({
    onSuccess() {
      form.reset();
      onSuccess?.();
      toast.success("Detalhe da Ata atualizado com sucesso!", { position: "bottom-right" });
      router.refresh();
    },
    onError(error) {
      console.error("Erro ao atualizar Detalhe da Ata:", error.message);
      toast.error("Erro ao atualizar Detalhe da Ata");
    },
  });

  const onSubmit = async (formData: DetalhesAtaForm) => {
    try {
      if (formData.id) {
        await updateRecord.mutateAsync(formData);
      } else {
        // Certifique-se que ata_id está definido para criação
        if (!formData.ata_id) {
          toast.error("ID da Ata não informado");
          return;
        }
        await createRecord.mutateAsync(formData);
      }
    } catch (error) {
      console.error("Erro ao salvar Detalhe da Ata:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Data */}
        <FormField
          control={form.control}
          name="data"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? format(field.value, "PPP", { locale: ptBR })
                        : "Selecione uma data"}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <textarea
                  className="w-full rounded-md border border-gray-300 p-2"
                  placeholder="Descrição detalhada"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botão de salvar */}
        <Button type="submit" className="w-full">
          {data ? "Atualizar" : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}