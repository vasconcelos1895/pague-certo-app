"use client";

import { z } from "zod";
import GenericForm from "./GenericForm";
import { api } from "../utils/api";

const produtoSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  preco: z.number().min(0, "Preço deve ser positivo"),
  categoria: z.string().min(1, "Selecione uma categoria"),
  tags: z.array(z.string()).optional(),
  ativo: z.boolean().optional(),
});

const categorias = [
  { label: "Eletrônicos", value: "eletronicos" },
  { label: "Roupas", value: "roupas" },
  { label: "Alimentos", value: "alimentos" },
];

const tagsOptions = [
  { label: "Promoção", value: "promo" },
  { label: "Novo", value: "novo" },
  { label: "Mais Vendido", value: "top" },
];

export default function ProdutoCreate({name}:{name:string}) {
  const createProduto = api.produto.create.useMutation();

  const onSubmit = async (data: z.infer<typeof produtoSchema>) => {
    await createProduto.mutateAsync({
      ...data,
      preco: Number(data.preco),
    });
    alert("Produto criado com sucesso!");
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">{name}</h1>
      <GenericForm
        schema={produtoSchema}
        onSubmit={onSubmit}
        fields={{
          nome: { label: "Nome do Produto", type: "text", placeholder: "Ex: TV 50\"" },
          preco: { label: "Preço (R$)", type: "numericformat", placeholder: "0,00" },
          categoria: { label: "Categoria", type: "select", options: categorias },
          tags: { label: "Tags", type: "multiselect", options: tagsOptions },
          ativo: { label: "Ativo", type: "checkbox" },
        }}
        submitLabel="Criar Produto"
      />
    </div>
  );
}