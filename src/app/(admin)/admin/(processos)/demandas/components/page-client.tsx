"use client";

import { DataTableApp } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useState } from "react";
import { type TableColumn } from "react-data-table-component";
import { type DemandFormValues } from "@/lib/validators/demand";
import { CrudForm } from "./crud-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowBigDownDash, ArrowBigUpDash, CheckCircle2, Clock, List, MoreHorizontalIcon, Pencil, Plus, Trash, UnfoldVertical } from "lucide-react";
import { toast } from "sonner";
import { type Demand } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const defaultRecordValues: DemandFormValues = {
  clientId: "",
  responsible: "",
  priority: "BAIXA",
  notes: "",  
  status: "NAO_INICIADO",
};

function createTempRecord(record: {
  clientId: string;
  responsible: string
  priority: string
  notes?: string | undefined
  status: string
}) {
  return {
    id: "temp-id-" + Math.random().toString(36).slice(2, 2 + 9),
    clientId: record.clientId,
    responsible: record.responsible ?? null,
    priority: record.priority,
    notes: record.notes ?? null,
    status: record.status,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  NAO_INICIADO: {
    label: "Não iniciado",
    color: "bg-gray-200 text-gray-800",
    icon: <Clock className="h-4 w-4 mr-1" />,
  },
  EM_ANDAMENTO: {
    label: "Em andamento",
    color: "bg-blue-200 text-blue-800",
    icon: <MoreHorizontalIcon className="h-4 w-4 mr-1" />,
  },
  CONCLUIDO: {
    label: "Concluído",
    color: "bg-green-200 text-green-800",
    icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
  },
};

const priorityMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  BAIXA: {
    label: "Baixa",
    color: "bg-yellow-200 text-yellow-800",
    icon: <ArrowBigDownDash className="h-4 w-4 mr-1" />,
  },
  MEDIA: {
    label: "Média",
    color: "bg-orange-200 text-orange-800",
    icon: <UnfoldVertical className="h-4 w-4 mr-1" />,
  },
  ALTA: {
    label: "Alta",
    color: "bg-red-200 text-red-800",
    icon: <ArrowBigUpDash className="h-4 w-4 mr-1" />,
  },
};

export default function PageClient({demands, clients}: {demands: Demand[], clients: {id: string, name: string}[]}) {
  const utils = api.useUtils();
  const router = useRouter();

  // ✅ Optimistic Create + Toast
  const createRecord = api.demand.create.useMutation({
    async onMutate(newRecord) {
      await utils.demand.list.cancel();
      const prevData = utils.demand.list.getData();
      utils.demand.list.setData(undefined, (old) => [
        ...(old ?? []),
        createTempRecord(newRecord),
      ]);
      return { prevData };
    },
    onError: (err, _newRecord, ctx) => {
      if (ctx?.prevData) utils.demand.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao criar registro: ${err.message}`);
    },
    onSuccess: () => {
      toast.success("Registro criado com sucesso!");
    },
    onSettled: () => utils.demand.list.invalidate(),
  });

  // ✅ Optimistic Update + Toast
  const updateRecord = api.demand.update.useMutation({
    async onMutate(updatedRecord) {
      await utils.demand.list.cancel();
      const prevData = utils.demand.list.getData();
      utils.demand.list.setData(undefined, (old) =>
        (old ?? []).map((record) =>
          record.id === updatedRecord.id
            ? { ...record, ...updatedRecord }
            : record,
        ),
      );
      return { prevData };
    },
    onError: (err, _updatedRecord, ctx) => {
      if (ctx?.prevData) utils.demand.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao atualizar registro: ${err.message}`);
    },
    onSuccess: () => {
      toast.success("Registro atualizado com sucesso!");
    },
    onSettled: () => utils.demand.list.invalidate(),
  });

  // ✅ Optimistic Delete + Toast
  const deleteRecord = api.demand.delete.useMutation({
    async onMutate({ id }) {
      await utils.demand.list.cancel();
      const prevData = utils.demand.list.getData();
      utils.demand.list.setData(undefined, (old) =>
        (old ?? []).filter((record) => record.id !== id),
      );
      return { prevData };
    },
    onError: (err, _deletedRecord, ctx) => {
      if (ctx?.prevData) utils.demand.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao excluir registro: ${err.message}`);
    },
    onSuccess: () => {
      toast.success("Registro excluído com sucesso!");
    },
    onSettled: () => utils.demand.list.invalidate(),
  });

  const [editingRecord, setEditingRecord] = useState<Demand | null>(null);
  const [isOpen, setIsOpen] = useState(false);
 
  const handleSubmit = (values: DemandFormValues) => {
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

  const columns: TableColumn<Demand>[] = [
    { name: "Cliente", selector: (row) => row?.client.name, sortable: true },
    {
      name: "Registrado em",
      selector: row => row.createdAt ? new Date(row.createdAt).toLocaleString('pt-BR', {day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"}) : '',
      sortable: true,
    },
    {
      name: "Responsável",
      selector: (row) => row.responsible ?? "",
      sortable: true,
    },    
    {
      name: "Prioridade",
      cell: (row) => {
        const s = priorityMap[row.priority] ?? { label: row.priority, color: "", icon: null };
        return (
          <Badge className={`flex items-center px-2 py-1 rounded-full ${s.color}`}>
            {s.icon}
            {s.label}
          </Badge>
        );
      },      
      sortable: true,
    },    
    {
      name: "Status",
      cell: (row) => {
        const s = statusMap[row.status] ?? { label: row.status, color: "", icon: null };
        return (
          <Badge className={`flex items-center px-2 py-1 rounded-full ${s.color}`}>
            {s.icon}
            {s.label}
          </Badge>
        );
      },
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
            variant="outline"
            onClick={() => {
              router.push(`/admin/demandas/${row.id}`)
            }}
          >
            <List className="h-4 w-4" />
            Passivos
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
    <>
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
            clients={clients ?? []}
          />
        </DialogContent>
      </Dialog>

      <DataTableApp
        columns={columns}
        data={demands ?? []}
        urlReport="/api/reports/demand"
      />
    </>
  );
}