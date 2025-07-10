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
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MultiSelectApp } from "@/components/MultiselectApp";
import type { Sistema } from "@prisma/client";
import { CheckboxGroup } from "@/components/CheckboxGroup";

const pedidoSchema = z.object({
  id: z.number().optional(),
  data: z.date(),
  servidor: z.string().min(1, "Servidor é obrigatório"),
  origem: z.string().min(1, "Origem é obrigatória"),
  oficio: z.number(),
  itens: z.array(z.string()).optional(),
  itens_alt: z.array(z.string()).optional(),
  itens_cancel: z.array(z.string()).optional(),
});

type PedidoForm = z.infer<typeof pedidoSchema>;


interface PedidoFormProps {
  data: PedidoForm | null;
  onSuccess?: () => void;
  sistemas: Sistema[];
}

export default function CreateUpdate({
  data,
  onSuccess,
  sistemas,
}: PedidoFormProps) {
  const router = useRouter();

  const form = useForm<PedidoForm>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      id: data?.id,
      data: data?.data ? new Date(data.data) : new Date(),
      servidor: data?.servidor ?? "",
      origem: data?.origem ?? "",
      oficio: data?.oficio ?? 0,
      itens: data?.itens ?? [],
      itens_alt: data?.itens_alt ?? [],
      itens_cancel: data?.itens_cancel ?? [],
    },
  });

  // Mutations (estes devem estar configurados no seu api)
  const createPedido = api.pedido.create.useMutation({
    onSuccess() {
      toast.success("Pedido criado com sucesso");
      form.reset();
      onSuccess?.();
      router.refresh();
    },
    onError(error) {
      toast.error("Erro ao criar pedido: " + error.message);
    },
  });

  const updatePedido = api.pedido.update.useMutation({
    onSuccess() {
      toast.success("Pedido atualizado com sucesso");
      form.reset();
      onSuccess?.();
      router.refresh();
    },
    onError(error) {
      toast.error("Erro ao atualizar pedido: " + error.message);
    },
  });

  const onSubmit = (values: PedidoForm) => {

    console.log('values', values)
    // if (data?.id) {
    //   updatePedido.mutate({ ...values, id: data.id });
    // } else {
    //   createPedido.mutate(values);
    // }
  };


  const onError = (errors: any) => {
    console.log("Validation errors:", errors);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Data */}
        <FormField
          control={form.control}
          name="data"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value.toISOString().substring(0, 10)}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
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

        {/* Origem */}
        <FormField
          control={form.control}
          name="origem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origem</FormLabel>
              <FormControl>
                <Input placeholder="Origem do pedido" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Oficio */}
        <FormField
          control={form.control}
          name="oficio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ofício</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Número do ofício"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ---- Multiselects para Sistemas ---- */}

        <FormField
          control={form.control}
          name="itens"
          render={({ field }) => (
            <CheckboxGroup
              label="Sistemas (Inclusão)"
              options={sistemas.map((s) => ({ value: s.id, label: s.nome }))}
              selectedValues={field.value || []}
              onChange={field.onChange}
              description="Selecione os sistemas para inclusão."
            />
          )}
        />

        <FormField
          control={form.control}
          name="itens_alt"
          render={({ field }) => (
            <CheckboxGroup
              label="Sistemas (Alteração)"
              options={sistemas.map((s) => ({ value: s.id, label: s.nome }))}
              selectedValues={field.value || []}
              onChange={field.onChange}
              description="Selecione os sistemas para alteração."
            />
          )}
        />

        <FormField
          control={form.control}
          name="itens_cancel"
          render={({ field }) => (
            <CheckboxGroup
              label="Sistemas (Cancelamento)"
              options={sistemas.map((s) => ({ value: s.id, label: s.nome }))}
              selectedValues={field.value || []}
              onChange={field.onChange}
              description="Selecione os sistemas para cancelamento."
            />
          )}
        />

        {/* Botão Salvar */}
        <Button type="submit" className="w-full">
          {data ? "Atualizar Pedido" : "Criar Pedido"}
        </Button>
      </form>
    </Form>
  );
}