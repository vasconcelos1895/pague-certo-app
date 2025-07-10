"use client";

import { z } from "zod";
import GenericForm from "./GenericForm";
import { api } from "../utils/api";

const produtoSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  preco: z.number(),
  categoria: z.string(),
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

type ProdutoEditProps = {
  id: string;
};

export default function ProdutoEdit({ id }: ProdutoEditProps) {
  const { data: produto, isLoading } = api.produto.getById.useQuery(id);
  const updateProduto = api.produto.update.useMutation();

  if (isLoading) return <p>Carregando...</p>;
  if (!produto) return <p>Produto não encontrado</p>;

  const onSubmit = async (data: z.infer<typeof produtoSchema>) => {
    await updateProduto.mutateAsync({ id, ...data });
    alert("Produto atualizado com sucesso!");
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Editar Produto</h1>
      <GenericForm
        schema={produtoSchema}
        defaultValues={{
          nome: produto.nome,
          preco: produto.preco,
          categoria: produto.categoria,
          tags: produto.tags,
          ativo: produto.ativo,
        }}
        onSubmit={onSubmit}
        fields={{
          nome: { label: "Nome do Produto", type: "text" },
          preco: { label: "Preço (R$)", type: "numericformat" },
          categoria: { label: "Categoria", type: "select", options: categorias },
          tags: { label: "Tags", type: "multiselect", options: tagsOptions },
          ativo: { label: "Ativo", type: "checkbox" },
        }}
        submitLabel="Salvar Alterações"
      />
    </div>
  );
}