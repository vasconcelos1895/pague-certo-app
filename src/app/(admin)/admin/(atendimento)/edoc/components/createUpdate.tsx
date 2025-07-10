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
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Validação com Zod conforme modelo AtendimentoEdoc
const atendimentoEdocSchema = z.object({
  id: z.string().optional(),
  data: z.date(),
  hora: z.string().min(1, "Hora é obrigatória"),
  servidor: z.string().min(1, "Servidor é obrigatório"),
  situacao: z.string().min(1, "Situação é obrigatória"),
  orgao: z.string().min(1, "Órgão é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  data_realizado: z.date().optional(),
  hora_realizado: z.string().optional(),
});

// Opções de situação  
const situacaoOptions = [  
  { value: 'PENDENTE', label: 'Pendente' },  
  { value: 'EM ANDAMENTO', label: 'Em Andamento' },  
  { value: 'CONCLUÍDO', label: 'Concluído' },  
];  

// Opções de situação  
const tipoAtendimento = [  
  { value: 'outros', label: 'Outros' },    
  { value: 'parametrizacao', label: 'Parametrização' },  
  { value: 'rascunho', label: 'Rascunho' },  
  { value: 'unidade_administrativa', label: 'Unidade Administrativa' },  
  { value: 'usuario', label: 'Usuário' },    
]; 

export default function AtendimentoEdocCreateUpdate({
  data,
  onSuccess,
}: {
  data: any | null; // Você pode tipar conforme necessário
  onSuccess?: () => void;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof atendimentoEdocSchema>>({
    resolver: zodResolver(atendimentoEdocSchema),
    defaultValues: {
      id: data?.id.toString() ?? '',
      data: data?.data ? new Date(data?.data) : new Date(),  
      hora: data?.hora ?? '',
      servidor: data?.servidor ?? '',
      situacao: data?.situacao ?? '',
      orgao: data?.orgao ?? '',
      descricao: data?.descricao ?? '',
      data_realizado: data?.data_realizado ? new Date(data?.data_realizado) : new Date(),  
      hora_realizado: data?.hora_realizado ?? '',
    }
  });

  // Mutations para criação e atualização (ajuste para sua API)
  const createRecord = api.atendimentoEdoc.create.useMutation({
    onSuccess() {
      form.reset();
      onSuccess?.();
      toast.success("GETT-HELP-DESK", {
        description: "Registro salvo com sucesso",
        position: 'bottom-right'
      })       
      router.refresh();
    },
    onError(error) {
      console.error("Erro ao criar atendimento.", error.message);
    },
  });

  const updateRecord = api.atendimentoEdoc.update.useMutation({
    onSuccess() {
      form.reset();
      onSuccess?.();
      toast.success("GETT-HELP-DESK", {
        description: "Registro salvo com sucesso",
        position: 'bottom-right'
      })       
      router.refresh();
    },
    onError(error) {
      console.error("Erro ao atualizar atendimento.", error.message);
    },
  });

  const onSubmit = async (formData: z.infer<typeof atendimentoEdocSchema>) => {
    try {
      if (data?.id) {
        await updateRecord.mutateAsync({
          ...formData,
          id: parseInt(formData.id || "0"),
        });
      } else {
        await createRecord.mutateAsync(formData);
      }
    } catch (error) {
      console.error("Erro ao salvar atendimento:", error);
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
              <FormLabel>Data do Atendimento</FormLabel>
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
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
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

        {/* Hora */}
        <FormField
          control={form.control}
          name="hora"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora do Atendimento</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Servidor */}
        <FormField
          control={form.control}
          name="servidor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Servidor</FormLabel>
              <FormControl>
                <Input placeholder="Nome do servidor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* Situação */}
        <FormField
          control={form.control}
          name="situacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Situacao</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {situacaoOptions.map((situacao) => (
                    <SelectItem
                      key={situacao.value}
                      value={situacao.value.toString()}
                    >
                      {situacao.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Órgão */}
        <FormField
          control={form.control}
          name="orgao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Órgão</FormLabel>
              <FormControl>
                <Input placeholder="Órgão" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Situação */}
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição da Solicitação</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tipoAtendimento.map((atendimento) => (
                    <SelectItem
                      key={atendimento.value}
                      value={atendimento.value.toString()}
                    >
                      {atendimento.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Data Realizado */}
        <FormField
          control={form.control}
          name="data_realizado"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data do Serviço Realizado</FormLabel>
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
                      {field.value ? (
                        format(field.value, "PPP", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
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

        {/* Hora Realizado */}
        <FormField
          control={form.control}
          name="hora_realizado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hora do Serviço Realizado</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
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