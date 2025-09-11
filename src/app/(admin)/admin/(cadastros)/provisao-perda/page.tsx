"use client";

import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useState } from "react";
import { type TableColumn } from "react-data-table-component";
import { type ProvisionForIncurredLosseFormValues } from "@/lib/validators/provisionForIncurredLosse";
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
import { type ProvisionForIncurredLosse } from "@prisma/client";

const defaultRecordValues: ProvisionForIncurredLosseFormValues = {
  criteria: "",
  initialDeadline: "",
  finalDeadline: "",
  percentageC1: "",
  percentageC2: "",
  percentageC3: "",
  percentageC4: "",
  percentageC5: "",
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
  const { data: provisionForIncurredLosse } = api.provisionForIncurredLosse.list.useQuery();

  // ✅ Optimistic Create + Toast
  const createRecord = api.provisionForIncurredLosse.create.useMutation({
    async onMutate(newRecord) {
      await utils.provisionForIncurredLosse.list.cancel();
      const prevData = utils.provisionForIncurredLosse.list.getData();
      utils.provisionForIncurredLosse.list.setData(undefined, (old) => [
        ...(old ?? []),
        createTempRecord(newRecord),
      ]);
      return { prevData };
    },
    onError: (err, _newRecord, ctx) => {
      if (ctx?.prevData) utils.provisionForIncurredLosse.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao criar registro: ${err.message}`);
    },
    onSuccess: () => {
      toast.success("Registro criado com sucesso!");
    },
    onSettled: () => utils.provisionForIncurredLosse.list.invalidate(),
  });

  // ✅ Optimistic Update + Toast
  const updateRecord = api.provisionForIncurredLosse.update.useMutation({
    async onMutate(updatedRecord) {
      await utils.provisionForIncurredLosse.list.cancel();
      const prevData = utils.provisionForIncurredLosse.list.getData();
      utils.provisionForIncurredLosse.list.setData(undefined, (old) =>
        (old ?? []).map((record) =>
          record.id === updatedRecord.id
            ? { ...record, ...updatedRecord }
            : record,
        ),
      );
      return { prevData };
    },
    onError: (err, _updatedRecord, ctx) => {
      if (ctx?.prevData) utils.provisionForIncurredLosse.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao atualizar registro: ${err.message}`);
    },
    onSuccess: () => {
      toast.success("Registro atualizado com sucesso!");
    },
    onSettled: () => utils.provisionForIncurredLosse.list.invalidate(),
  });

  // ✅ Optimistic Delete + Toast
  const deleteRecord = api.provisionForIncurredLosse.delete.useMutation({
    async onMutate({ id }) {
      await utils.provisionForIncurredLosse.list.cancel();
      const prevData = utils.provisionForIncurredLosse.list.getData();
      utils.provisionForIncurredLosse.list.setData(undefined, (old) =>
        (old ?? []).filter((record) => record.id !== id),
      );
      return { prevData };
    },
    onError: (err, _deletedRecord, ctx) => {
      if (ctx?.prevData) utils.provisionForIncurredLosse.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao excluir registro: ${err.message}`);
    },
    onSuccess: () => {
      toast.success("Registro excluído com sucesso!");
    },
    onSettled: () => utils.provisionForIncurredLosse.list.invalidate(),
  });

  const [editingRecord, setEditingRecord] = useState<ProvisionForIncurredLosse | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (values: ProvisionForIncurredLosseFormValues) => {
    const payload = {
      ...values
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

  const columns: TableColumn<ProvisionForIncurredLosse>[] = [
    { name: "Nome", 
      selector: (row) => row.criteria ?? ""
     },
    {
      name: "Prazo Inicial (meses)",
      selector: (row) => row.initialDeadline != null
        ? row.initialDeadline.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        : "",      
      width: '150px',
    },
    {
      name: "Prazo Final",      
      selector: (row) => row.finalDeadline != null
        ? row.finalDeadline.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        : "",            
      width: '150px',      
    },    
    {
      name: "C1 (%)",
      selector: (row) => row.percentageC1 != null
        ? row.percentageC1.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        : "",
      width: '100px',
    },        

    {
      name: "C2 (%)",
      selector: (row) => row.percentageC2 != null
        ? row.percentageC2.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        : "",
      width: '100px',
    },        
    {
      name: "C3 (%)",
      selector: (row) => row.percentageC3 != null
        ? row.percentageC3.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        : "",
      width: '100px',
    },        

    {
      name: "C4 (%)",
      selector: (row) => row.percentageC4 != null
        ? row.percentageC4.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        : "",
      width: '100px',
    },        

    {
      name: "C5 (%)",
      selector: (row) => row.percentageC5 != null
        ? row.percentageC5.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
        : "",
      width: '100px',
    },                        
    {
      name: "Ações",
      cell: (row) => {
        const payload = {
          ...row,
          initialDeadline: row.initialDeadline?.toString(),
          finalDeadline: row.finalDeadline?.toString(),
          percentageC1: row.percentageC1?.toString(),
          percentageC2: row.percentageC2?.toString(),
          percentageC3: row.percentageC3?.toString(),
          percentageC4: row.percentageC4?.toString(),
          percentageC5: row.percentageC5?.toString(),
        }

        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditingRecord(payload);
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
        )
      },
    },
  ];

  return (
    <PageLayout
      index={false}
      link={"/admin"}
      label={"Provisão para Perdas"}
      description={"Provisão para perdas incorridas aplicável aos ativos financeiros inadimplidos"}
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
        data={provisionForIncurredLosse ?? []}
        urlReport="provision-for-incurred-losse"
      />
    </PageLayout>
  );
}
