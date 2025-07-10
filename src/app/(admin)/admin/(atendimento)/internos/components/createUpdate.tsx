"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ptBR } from "date-fns/locale";
import {
  Form,
  FormControl,
  FormDescription,
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
  SelectValue
} from "@/components/ui/select";
import { Interno, Setor } from "@prisma/client";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Opções de tipo de equipamento
const tipoEquipamentoOptions = [
  { value: 'COMPUTADOR', label: 'Computador' },
  { value: 'MONITOR', label: 'Monitor' },
  { value: 'IMPRESSORA', label: 'Impressora' },
  { value: 'TELEFONE', label: 'Telefone' },
];

// Opções de situação  
const situacaoOptions = [  
  { value: 'PENDENTE', label: 'Pendente' },  
  { value: 'EM ANDAMENTO', label: 'Em Andamento' },  
  { value: 'CONCLUÍDO', label: 'Concluído' },  
];  

// Esquema de validação
const internoSchema = z.object({
  id: z.string().optional(),
  data: z.date(),
  hora: z.string().min(1, "Hora é obrigatória"),
  setor_id: z.coerce.number().min(1, "Setor é obrigatório"),
  tipo_equipamento: z.string().min(1, "Tipo de equipamento é obrigatório"),
  equipamento_id: z.coerce.number().min(1, "Equipamento é obrigatório"),
  servidor: z.string().min(1, "Servidor é obrigatório"),
  solicitacao: z.string().min(1, "Solicitação é obrigatória"),
  situacao: z.string().min(1, "Situação é obrigatória"),
  servico_realizado: z.string().optional(),
  data_realizado: z.date().optional(),
  hora_realizado: z.string().optional(),
});

export default function InternoCreateUpdate({
  data,
  onSuccess,
  setores
}: {
  data: Interno | null,
  onSuccess?: () => void,
  setores: Setor[]
}) {
  const router = useRouter();

  console.log('data interno',data)

  // Formulário
  const form = useForm<z.infer<typeof internoSchema>>({
    resolver: zodResolver(internoSchema),
    defaultValues: {
      id: data?.id.toString() ?? '',
      data: data?.data ? new Date(data?.data) : new Date(),
      hora: data?.hora ?? '',
      setor_id: data?.setor_id ?? undefined,
      tipo_equipamento: data?.tipo_equipamento ?? '',
      equipamento_id: data?.equipamento_id ?? undefined,
      servidor: data?.servidor ?? '',
      solicitacao: data?.solicitacao ?? '',
      situacao: data?.situacao ?? '',
      servico_realizado: data?.servico_realizado ?? '',
      data_realizado: data?.data_realizado ? new Date(data?.data_realizado) : new Date(),
      hora_realizado: data?.hora_realizado ?? '',
    }
  });

  // Observar valores do formulário  
  const watchSetorId = form.watch('setor_id');
  const watchTipoEquipamento = form.watch('tipo_equipamento');

  // Buscar equipamentos baseado no setor e tipo
  const equipamentosQuery = api.computador.getBySetorAndTipo.useQuery(
    {
      setor_id: Number(watchSetorId)
    },
    {
      enabled: !!watchSetorId && watchTipoEquipamento === 'COMPUTADOR',
      // Opcional: Adicione placeholders ou tratamento de carregamento
      placeholderData: []
    }
  );

  // Queries para outros tipos de equipamento
  const monitorQuery = api.monitor.getBySetorAndTipo.useQuery(
    {
      setor_id: Number(watchSetorId)
    },
    {
      enabled: !!watchSetorId && watchTipoEquipamento === 'MONITOR',
      placeholderData: []
    }
  );

  const impressoraQuery = api.impressora.getBySetorAndTipo.useQuery(
    {
      setor_id: Number(watchSetorId)
    },
    {
      enabled: !!watchSetorId && watchTipoEquipamento === 'IMPRESSORA',
      placeholderData: []
    }
  );

  const telefoneQuery = api.telefone.getBySetorAndTipo.useQuery(
    {
      setor_id: Number(watchSetorId)
    },
    {
      enabled: !!watchSetorId && watchTipoEquipamento === 'TELEFONE',
      placeholderData: []
    }
  );

  // Mutation para criar registro
  const createRecord = api.interno.create.useMutation({
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
      console.error('Erro interno.', error.message);
    }
  });

  // Mutation para atualizar registro
  const updateRecord = api.interno.update.useMutation({
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
      console.error('Erro interno.', error.message);
    }
  });

  // Função de submissão
  const onSubmit = async (formData: z.infer<typeof internoSchema>) => {
    try {
      if (data?.id) {
        await updateRecord.mutateAsync({
          ...formData,
          id: parseInt(formData.id)
        });
      } else {
        await createRecord.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Erro ao salvar registro:', error);
    }
  };

  // Função para selecionar dados de equipamento corretos
  const getEquipamentosOptions = () => {
    switch (watchTipoEquipamento) {
      case 'COMPUTADOR':
        return equipamentosQuery.data?.map((eq) => ({
          value: eq.id.toString(),
          label: eq.identificador
        })) || [];
      case 'MONITOR':
        return monitorQuery.data?.map((eq) => ({
          value: eq.id.toString(),
          label: eq.identificador
        })) || [];
      case 'IMPRESSORA':
        return impressoraQuery.data?.map((eq) => ({
          value: eq.id.toString(),
          label: eq.identificador
        })) || [];
      case 'TELEFONE':
        return telefoneQuery.data?.map((eq) => ({
          value: eq.id.toString(),
          label: eq.identificador
        })) || [];
      default:
        return [];
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

        <FormField
          control={form.control}
          name="setor_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Setor</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Resetar campos dependentes
                  form.setValue('tipo_equipamento', '');
                  form.setValue('equipamento_id', undefined);
                }}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um setor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {setores.map((setor) => (
                    <SelectItem
                      key={setor.id}
                      value={setor.id.toString()}
                    >
                      {setor.sigla}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo de Equipamento */}
        <FormField
          control={form.control}
          name="tipo_equipamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Equipamento</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  // Resetar equipamento
                  form.setValue('equipamento_id', undefined);
                }}
                defaultValue={field.value}
                disabled={!watchSetorId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tipoEquipamentoOptions.map((tipo) => (
                    <SelectItem
                      key={tipo.value}
                      value={tipo.value}
                    >
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />


        {/* Equipamento */}
        <FormField
          control={form.control}
          name="equipamento_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Equipamento</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value?.toString()}
                disabled={!watchSetorId || !watchTipoEquipamento}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um equipamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getEquipamentosOptions().map((eq) => (
                    <SelectItem key={eq.value} value={eq.value}>
                      {eq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

        <FormField
          control={form.control}
          name="solicitacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Solicitação</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva qual a solicitação do usuário."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
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
              <FormLabel>Data do Serviço</FormLabel>
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
              <FormLabel>Hora do Serviço</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="servico_realizado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serviço Realizado</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva qual o serviço foi realizado na unidade."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botão de Submissão */}
        <Button type="submit" className="w-full">
          {data ? 'Atualizar' : 'Salvar'}
        </Button>
      </form>
    </Form>
  );
}