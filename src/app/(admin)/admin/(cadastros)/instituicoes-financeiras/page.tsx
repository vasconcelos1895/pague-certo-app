"use client";

import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useState } from "react";
import { type TableColumn } from "react-data-table-component";
import { type BankFormValues } from "@/lib/validators/bank";
import { BankForm } from "./components/bank-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

interface Bank {
  id: string;
  name: string;
  code: string;
}

export default function Page() {
  const utils = api.useUtils();
  const { data: banks } = api.bank.list.useQuery();

  function createTempBank(bank: { name: string; code: string }) {
    return {
      id: "temp-id-" + Math.random().toString(36).substr(2, 9),
      name: bank.name,
      code: bank.code,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  // ✅ Optimistic Create + Toast
  const createBank = api.bank.create.useMutation({
    async onMutate(newBank) {
      await utils.bank.list.cancel();
      const prevData = utils.bank.list.getData();
      utils.bank.list.setData(undefined, (old) => [
        ...(old ?? []),
        createTempBank(newBank),
      ]);
      return { prevData };
    },
    onError: (err, _newBank, ctx) => {
      if (ctx?.prevData) utils.bank.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao criar banco: ${err.message}`);
    },
    onSuccess: () => {
      toast.success("Banco criado com sucesso!");
    },
    onSettled: () => utils.bank.list.invalidate(),
  });

  // ✅ Optimistic Update + Toast
  const updateBank = api.bank.update.useMutation({
    async onMutate(updatedBank) {
      await utils.bank.list.cancel();
      const prevData = utils.bank.list.getData();
      utils.bank.list.setData(undefined, (old) =>
        (old ?? []).map((bank) =>
          bank.id === updatedBank.id ? { ...bank, ...updatedBank } : bank,
        ),
      );
      return { prevData };
    },
    onError: (err, _updatedBank, ctx) => {
      if (ctx?.prevData) utils.bank.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao atualizar banco: ${err.message}`);
    },
    onSuccess: () => {
      toast.success("Banco atualizado com sucesso!");
    },
    onSettled: () => utils.bank.list.invalidate(),
  });

  // ✅ Optimistic Delete + Toast
  const deleteBank = api.bank.delete.useMutation({
    async onMutate({ id }) {
      await utils.bank.list.cancel();
      const prevData = utils.bank.list.getData();
      utils.bank.list.setData(undefined, (old) =>
        (old ?? []).filter((bank) => bank.id !== id),
      );
      return { prevData };
    },
    onError: (err, _deletedBank, ctx) => {
      if (ctx?.prevData) utils.bank.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao excluir banco: ${err.message}`);
    },
    onSuccess: () => {
      toast.success("Banco excluído com sucesso!");
    },
    onSettled: () => utils.bank.list.invalidate(),
  });

  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (values: BankFormValues) => {
    if (editingBank) {
      updateBank.mutate({ id: editingBank.id, ...values });
    } else {
      createBank.mutate(values);
    }
    setIsOpen(false);
    setEditingBank(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente excluir este banco?")) {
      deleteBank.mutate({ id });
    }
  };

  const columns: TableColumn<Bank>[] = [
    { name: "Nome", selector: (row) => row.name, sortable: true },
    { name: "Código", selector: (row) => row.code, sortable: true },
    {
      name: "Ações",
      cell: (row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditingBank(row);
              setIsOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(row.id)}
          >
            <Trash className="h-4 w-4" />
            Excluir
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      index={false}
      link={"/admin"}
      label={"Instituições Financeiras"}
      description={"Listagem de instituições financeiras"}
      notBreadcrumb={false}
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="flex w-[130px] gap-2"
            variant={"secondary"}
            onClick={() => setEditingBank(null)}
          >
            <Plus className="h-4 w-4" /> Novo Banco
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBank ? "Editar Banco" : "Novo Banco"}
            </DialogTitle>
          </DialogHeader>
          <BankForm
            defaultValues={editingBank ?? {}}
            onSubmit={handleSubmit}
            isLoading={createBank.isPending || updateBank.isPending}
          />
        </DialogContent>
      </Dialog>

      <DataTableApp
        columns={columns}
        data={banks ?? []}
        urlReport="/api/reports/banks"
      />
    </PageLayout>
  );
}
