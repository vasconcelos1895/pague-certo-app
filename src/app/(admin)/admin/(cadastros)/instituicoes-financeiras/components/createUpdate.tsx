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
import {  
  Select,  
  SelectContent,  
  SelectItem,  
  SelectTrigger,  
  SelectValue  
} from "@/components/ui/select";  
import { Computador } from "@prisma/client";  
import { api } from "@/trpc/react";  
import { useRouter } from "next/navigation";  
import { Textarea } from "@/components/ui/textarea";  
import { toast } from "sonner";

// Esquema de validação  
const computadorSchema = z.object({  
  id: z.number().optional(),  
  setor_id: z.coerce.number().min(1, "Setor é obrigatório"),  
  responsavel: z.string().min(1, "Responsável é obrigatório"),  
  patrimonio: z.string().min(1, "Patrimônio é obrigatório"),  
  inventario: z.string().min(1, "Inventário é obrigatório"),  
  especificacao: z.string().optional(),  
});  

export default function CreateUpdate({  
  data,  
  onSuccess,  
}: {  
  data: Computador | null,  
  onSuccess?: () => void,  
}) {  
  const router = useRouter();  

  // Formulário  
  const form = useForm<z.infer<typeof computadorSchema>>({  
    resolver: zodResolver(computadorSchema),  
    defaultValues: {  
      id: data?.id,  
      setor_id: data?.setor_id ?? undefined,  
      responsavel: data?.responsavel ?? '',  
      patrimonio: data?.patrimonio ?? '',  
      inventario: data?.inventario ?? '',  
      especificacao: data?.especificacao ?? '',  
    }  
  });  

  // Mutation para criar registro  
  const createRecord = api.computador.create.useMutation({  
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
      console.error('Erro ao criar computador.', error.message);  
    }  
  });  

  // Mutation para atualizar registro  
  const updateRecord = api.computador.update.useMutation({  
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
      console.error('Erro ao atualizar computador.', error.message);  
    }  
  });  

  // Função de submissão  
  const onSubmit = async (formData: z.infer<typeof computadorSchema>) => {  
    try {  
      if (data?.id) {  
        await updateRecord.mutateAsync({  
          ...formData,  
          id: formData.id!  
        });  
      } else {  
        await createRecord.mutateAsync(formData);  
      }  
    } catch (error) {  
      console.error('Erro ao salvar registro:', error);  
    }  
  };  

  return (  
    <Form {...form}>  
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">  
        {/* Setor */}  
        <FormField  
          control={form.control}  
          name="setor_id"  
          render={({ field }) => (  
            <FormItem>  
              <FormLabel>Setor</FormLabel>  
              <Select  
                onValueChange={(value) => {  
                  field.onChange(value);  
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

        {/* Responsável */}  
        <FormField  
          control={form.control}  
          name="responsavel"  
          render={({ field }) => (  
            <FormItem>  
              <FormLabel>Responsável</FormLabel>  
              <FormControl>  
                <Input placeholder="Nome do responsável" {...field} />  
              </FormControl>  
              <FormMessage />  
            </FormItem>  
          )}  
        />  

        {/* Patrimônio */}  
        <FormField  
          control={form.control}  
          name="patrimonio"  
          render={({ field }) => (  
            <FormItem>  
              <FormLabel>Patrimônio</FormLabel>  
              <FormControl>  
                <Input placeholder="Número do patrimônio" {...field} />  
              </FormControl>  
              <FormMessage />  
            </FormItem>  
          )}  
        />  

        {/* Inventário */}  
        <FormField  
          control={form.control}  
          name="inventario"  
          render={({ field }) => (  
            <FormItem>  
              <FormLabel>Inventário</FormLabel>  
              <FormControl>  
                <Input placeholder="Número do inventário" {...field} />  
              </FormControl>  
              <FormMessage />  
            </FormItem>  
          )}  
        />  

        {/* Especificação */}  
        <FormField  
          control={form.control}  
          name="especificacao"  
          render={({ field }) => (  
            <FormItem>  
              <FormLabel>Especificação</FormLabel>  
              <FormControl>  
                <Textarea  
                  placeholder="Detalhes técnicos do computador"  
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