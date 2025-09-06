"use client";

import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useState } from "react";
import { type TableColumn } from "react-data-table-component";
import { type ModelFormValues } from "@/lib/validators/recoveryType";
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
import { type RecoveryType } from "@prisma/client";

const defaultRecordValues: ModelFormValues = {
  name: "",
  description: "",
};

function createTempRecord(record: {
  name: string;
  description?: string | null;
}) {
  return {
    id: "temp-id-" + Math.random().toString(36).slice(2, 2 + 9),
    name: record.name,
    description: record.description ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export default function Page() {
  const utils = api.useUtils();
  const { data: recoveryTypes } = api.recoveryType.list.useQuery();

  // ✅ Optimistic Create + Toast
  const createRecord = api.recoveryType.create.useMutation({
    async onMutate(newRecord) {
      await utils.recoveryType.list.cancel();
      const prevData = utils.recoveryType.list.getData();
      utils.recoveryType.list.setData(undefined, (old) => [
        ...(old ?? []),
        createTempRecord(newRecord),
      ]);
      return { prevData };
    },
    onError: (err, _newRecord, ctx) => {
      if (ctx?.prevData) utils.recoveryType.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao criar registro: ${err.message}`);
    },
    onSuccess: () => {
      toast.success("Registro criado com sucesso!");
    },
    onSettled: () => utils.recoveryType.list.invalidate(),
  });

  // ✅ Optimistic Update + Toast
  const updateRecord = api.recoveryType.update.useMutation({
    async onMutate(updatedRecord) {
      await utils.recoveryType.list.cancel();
      const prevData = utils.recoveryType.list.getData();
      utils.recoveryType.list.setData(undefined, (old) =>
        (old ?? []).map((record) =>
          record.id === updatedRecord.id
            ? { ...record, ...updatedRecord }
            : record,
        ),
      );
      return { prevData };
    },
    onError: (err, _updatedRecord, ctx) => {
      if (ctx?.prevData) utils.recoveryType.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao atualizar registro: ${err.message}`);
    },
    onSuccess: () => {
      toast.success("Registro atualizado com sucesso!");
    },
    onSettled: () => utils.recoveryType.list.invalidate(),
  });

  // ✅ Optimistic Delete + Toast
  const deleteRecord = api.recoveryType.delete.useMutation({
    async onMutate({ id }) {
      await utils.recoveryType.list.cancel();
      const prevData = utils.recoveryType.list.getData();
      utils.recoveryType.list.setData(undefined, (old) =>
        (old ?? []).filter((record) => record.id !== id),
      );
      return { prevData };
    },
    onError: (err, _deletedRecord, ctx) => {
      if (ctx?.prevData) utils.recoveryType.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao excluir registro: ${err.message}`);
    },
    onSuccess: () => {
      toast.success("Registro excluído com sucesso!");
    },
    onSettled: () => utils.recoveryType.list.invalidate(),
  });

  const [editingRecord, setEditingRecord] = useState<RecoveryType | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (values: ModelFormValues) => {
    const payload = {
      ...values,
      description: values.description ?? undefined, // ← aqui converte null para undefined
    };

    if (editingRecord) {
      updateRecord.mutate({ id: editingRecord.id, ...payload });
    } else {
      createRecord.mutate(payload);
    }
    setIsOpen(false);
    setEditingRecord(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente excluir este registro?")) {
      deleteRecord.mutate({ id });
    }
  };

  const columns: TableColumn<RecoveryType>[] = [
    { name: "Nome", selector: (row) => row.name, sortable: true },
    {
      name: "Descrição",
      selector: (row) => row.description ?? "",
      sortable: true,
    },
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
      label={"Tipos de Recuperação"}
      description={"Listagem de tipos de recuperação"}
      notBreadcrumb={false}
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="flex w-[130px] gap-2"
            variant={"secondary"}
            onClick={() => setEditingRecord(null)}
          >
            <Plus className="h-4 w-4" /> Novo Registro
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingRecord ? "Editar Registro" : "Novo Registro"}
            </DialogTitle>
          </DialogHeader>
          <CrudForm
            defaultValues={editingRecord ?? defaultRecordValues}
            onSubmit={handleSubmit}
            isLoading={createRecord.isPending || updateRecord.isPending}
          />
        </DialogContent>
      </Dialog>

      <DataTableApp
        columns={columns}
        data={recoveryTypes ?? []}
        urlReport="/api/reports/operations"
      />
    </PageLayout>
  );
}
