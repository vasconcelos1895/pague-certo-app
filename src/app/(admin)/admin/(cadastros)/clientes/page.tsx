"use client";

import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { type TableColumn } from "react-data-table-component";
import { Pencil, Plus, Trash } from "lucide-react";
import { toast } from "sonner";
import { type Client } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function Page() {
  const utils = api.useUtils();
  const router = useRouter();
  const { data: clients } = api.customer.list.useQuery();

  // ✅ Optimistic Delete + Toast
  const deleteRecord = api.customer.delete.useMutation({
    async onMutate({ id }) {
      await utils.customer.list.cancel();
      const prevData = utils.customer.list.getData();
      utils.customer.list.setData(undefined, (old) => (old ?? []).filter((c) => c.id !== id));
      return { prevData };
    },
    onError: (err, _deletedRecord, ctx) => {
      if (ctx?.prevData) utils.customer.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao excluir registro: ${err.message}`);
    },
    onSuccess: () => toast.success("Registro excluído com sucesso!"),
    onSettled: () => utils.customer.list.invalidate(),
  });

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente excluir este registro?")) {
      deleteRecord.mutate({ id });
    }
  };

  const columns: TableColumn<Client>[] = [
    { name: "Nome", selector: (row) => row.name, sortable: true },
    { name: "E-mail", selector: (row) => row.email ?? "", sortable: true },
    { name: "Telefone", selector: (row) => row.primaryPhone ?? "", sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    {
      name: "Ações",
      cell: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => router.push(`/admin/clientes/${row.id}`)}>
            <Pencil className="h-4 w-4" /> Editar
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(row.id)}>
            <Trash className="h-4 w-4" /> Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      index={false}
      link="/admin"
      label="Clientes"
      description="Listagem de clientes"
      notBreadcrumb={false}
    >
      <Button className="w-[130px]" variant={"secondary"} onClick={() => router.push("/admin/clientes/novo")}>
        <Plus className="h-4 w-4" /> Novo Registro
      </Button>      

      <DataTableApp columns={columns} data={clients ?? []} urlReport="/api/reports/clients" />
    </PageLayout>
  );
}
