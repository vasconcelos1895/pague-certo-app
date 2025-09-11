"use client";

import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useState } from "react";
import { type TableColumn } from "react-data-table-component";
import { type BankFormValues } from "@/lib/validators/bank";
import { CrudForm } from "./components/crud-form";
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

const defaultBankValues: BankFormValues = {
  name: "",
  code: "",
};

function createTempBank(record: { name: string; code: string }) {
  return {
    id: "temp-id-" + Math.random().toString(36).slice(2, 2 + 9),
    name: record.name,
    code: record.code,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export default function Page() {
  const utils = api.useUtils();
  const { data: banks } = api.bank.list.useQuery();

  // ✅ Optimistic Create + Toast
  const createRecord = api.bank.create.useMutation({
    async onMutate(newRecord) {
      await utils.bank.list.cancel();
      const prevData = utils.bank.list.getData();
      utils.bank.list.setData(undefined, (old) => [
        ...(old ?? []),
        createTempBank(newRecord),
      ]);
      return { prevData };
    },
    onError: (err, _newRecord, ctx) => {
      if (ctx?.prevData) utils.bank.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao criar banco: ${err.message}`);
    },
    onSuccess: () => {
      toast.success("Banco criado com sucesso!");
    },
    onSettled: () => utils.bank.list.invalidate(),
  });

  // ✅ Optimistic Update + Toast
  const updateRecord = api.bank.update.useMutation({
    async onMutate(updatedRecord) {
      await utils.bank.list.cancel();
      const prevData = utils.bank.list.getData();
      utils.bank.list.setData(undefined, (old) =>
        (old ?? []).map((record) =>
          record.id === updatedRecord.id ? { ...record, ...updatedRecord } : record,
        ),
      );
      return { prevData };
    },
    onError: (err, _updatedRecord, ctx) => {
      if (ctx?.prevData) utils.bank.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao atualizar banco: ${err.message}`);
    },
    onSuccess: () => {
      toast.success("Banco atualizado com sucesso!");
    },
    onSettled: () => utils.bank.list.invalidate(),
  });

  // ✅ Optimistic Delete + Toast
  const deleteRecord = api.bank.delete.useMutation({
    async onMutate({ id }) {
      await utils.bank.list.cancel();
      const prevData = utils.bank.list.getData();
      utils.bank.list.setData(undefined, (old) =>
        (old ?? []).filter((record) => record.id !== id),
      );
      return { prevData };
    },
    onError: (err, _deletedRecord, ctx) => {
      if (ctx?.prevData) utils.bank.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao excluir banco: ${err.message}`);
    },
    onSuccess: () => {
      toast.success("Banco excluído com sucesso!");
    },
    onSettled: () => utils.bank.list.invalidate(),
  });

  const [editingRecord, setEditingRecord] = useState<Bank | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (values: BankFormValues) => {
    if (editingRecord) {
      updateRecord.mutate({ id: editingRecord.id, ...values });
    } else {
      createRecord.mutate(values);
    }
    setIsOpen(false);
    setEditingRecord(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente excluir este banco?")) {
      deleteRecord.mutate({ id });
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
              setEditingRecord(row);
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
            onClick={() => setEditingRecord(null)}
          >
            <Plus className="h-4 w-4" /> Novo Banco
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRecord ? "Editar Banco" : "Novo Banco"}
            </DialogTitle>
          </DialogHeader>
          <CrudForm
            defaultValues={editingRecord ?? defaultBankValues}
            onSubmit={handleSubmit}
            isLoading={createRecord.isPending || updateRecord.isPending}
          />
        </DialogContent>
      </Dialog>

      <DataTableApp
        columns={columns}
        data={banks ?? []}
        urlReport="bank"
      />
    </PageLayout>
  );
}
