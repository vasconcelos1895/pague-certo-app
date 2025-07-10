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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";

// Opções para status (exemplo)
const statusOptions = [
  { value: "ABERTO", label: "Aberto" },
  { value: "FINALIZADO", label: "Finalizado" },
  { value: "CANCELADO", label: "Cancelado" },
];

// Validation schema baseado no seu model esperado
const ataSchema = z.object({
  id: z.number().optional(),
  data: z.date(),
  assunto: z.string().min(1, "Assunto é obrigatório"),
  status: z.string().min(1, "Status é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
});

type AtaForm = z.infer<typeof ataSchema>;

export default function AtaCreateUpdate({
  data,
  onSuccess,
}: {
  data: AtaForm | null;
  onSuccess?: () => void;
}) {
  const router = useRouter();

  const form = useForm<AtaForm>({
    resolver: zodResolver(ataSchema),
    defaultValues: {
      id: data?.id,
      data: data?.data ? new Date(data.data) : new Date(),
      assunto: data?.assunto ?? "",
      status: data?.status.trim().toUpperCase() ?? "",
      descricao: data?.descricao ?? "",
    },
  });

  // Mutations (exemplo para api trpc)
  const createRecord = api.ata.create.useMutation({
    onSuccess() {
      form.reset();
      onSuccess?.();
      toast.success("Ata criada com sucesso!", { position: "bottom-right" });
      router.refresh();
    },
    onError(error) {
      console.error("Erro ao criar ATA:", error.message);
      toast.error("Erro ao criar ATA");
    },
  });

  const updateRecord = api.ata.update.useMutation({
    onSuccess() {
      form.reset();
      onSuccess?.();
      toast.success("Ata atualizada com sucesso!", { position: "bottom-right" });
      router.refresh();
    },
    onError(error) {
      console.error("Erro ao atualizar ATA:", error.message);
      toast.error("Erro ao atualizar ATA");
    },
  });

  const onSubmit = async (formData: AtaForm) => {
    try {
      if (formData.id) {
        await updateRecord.mutateAsync(formData);
      } else {
        await createRecord.mutateAsync(formData);
      }
    } catch (error) {
      console.error("Erro ao salvar ATA:", error);
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
              <FormLabel>Data da Ata</FormLabel>
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

        {/* Assunto */}
        <FormField
          control={form.control}
          name="assunto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assunto</FormLabel>
              <FormControl>
                <Input placeholder="Assunto da Ata" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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