"use client";

import { DataTableApp } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { useState } from "react";
import { type TableColumn } from "react-data-table-component";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pencil,
  Plus,
  Trash,
  Clock,
  CheckCircle2,
  MoreHorizontalIcon,
  Ban,
  PauseCircle,
} from "lucide-react";
import { type PassiveRestructuring } from "@prisma/client";
import { PassiveRestructuringForm } from "./passive-restructuring-form";
import { ScrollArea } from "@/components/ui/scroll-area";


const statusMap: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  NAO_INICIADO: {
    label: "Não iniciado",
    color: "bg-gray-200 text-gray-800",
    icon: <Clock className="mr-1 h-4 w-4" />,
  },
  EM_ANDAMENTO: {
    label: "Em andamento",
    color: "bg-blue-200 text-blue-800",
    icon: <MoreHorizontalIcon className="mr-1 h-4 w-4" />,
  },
  CONCLUIDO: {
    label: "Concluído",
    color: "bg-green-200 text-green-800",
    icon: <CheckCircle2 className="mr-1 h-4 w-4" />,
  },
  SUSPENSO: {
    label: "Suspenso",
    color: "bg-yellow-200 text-yellow-800",
    icon: <PauseCircle className="mr-1 h-4 w-4" />,
  },
  CANCELADO: {
    label: "Cancelado",
    color: "bg-red-200 text-red-800",
    icon: <Ban className="mr-1 h-4 w-4" />,
  },
};


const defaultRecordValues = {
  demandId: "",
  bankId: "",
  operationId: "",
  recoveryTypeId: "",
  debtAmount: 0,
  financialBalance: 0,
  lastPayment: "",
  settlementProposal: "",
  finalAgreement: "",
  installments: "0",
  authority: "",
  office: "",
  Note: "",
  completionDate: ""  ,
  status: "NAO_INICIADO" as const,
};

function createTempRecord(record: typeof defaultRecordValues) {
  return {
    id: "temp-id-" + Math.random().toString(36).slice(2, 11),
    ...record,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as PassiveRestructuring;
}

export default function PageClient({
  demandId,
  records,
  banks,
  operations,
  recoveryTypes,
}: {
  demandId: string,
  records: PassiveRestructuring[];
  banks: { id: string; name: string }[];
  operations: { id: string; name: string }[];
  recoveryTypes: { id: string; name: string }[];
}) {
  const utils = api.useUtils();
  const router = useRouter();

  // ✅ Optimistic Create
  const createRecord = api.passiveRestructuring.create.useMutation({
    async onMutate(newRecord) {
      await utils.passiveRestructuring.list.cancel();
      const prevData = utils.passiveRestructuring.list.getData();
      utils.passiveRestructuring.list.setData(undefined, (old) => [
        ...(old ?? []),
        createTempRecord(newRecord),
      ]);
      return { prevData };
    },
    onError: (err, _newRecord, ctx) => {
      if (ctx?.prevData)
        utils.passiveRestructuring.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao criar: ${err.message}`);
    },
    onSuccess: () => toast.success("Registro criado!"),
    onSettled: () => utils.passiveRestructuring.list.invalidate(),
  });

  // ✅ Optimistic Update
  const updateRecord = api.passiveRestructuring.update.useMutation({
    async onMutate(updatedRecord) {
      await utils.passiveRestructuring.list.cancel();
      const prevData = utils.passiveRestructuring.list.getData();
      utils.passiveRestructuring.list.setData(undefined, (old) =>
        (old ?? []).map((r) =>
          r.id === updatedRecord.id ? { ...r, ...updatedRecord } : r,
        ),
      );
      return { prevData };
    },
    onError: (err, _updatedRecord, ctx) => {
      if (ctx?.prevData)
        utils.passiveRestructuring.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao atualizar: ${err.message}`);
    },
    onSuccess: () => toast.success("Registro atualizado!"),
    onSettled: () => utils.passiveRestructuring.list.invalidate(),
  });

  // ✅ Optimistic Delete
  const deleteRecord = api.passiveRestructuring.delete.useMutation({
    async onMutate({ id }) {
      await utils.passiveRestructuring.list.cancel();
      const prevData = utils.passiveRestructuring.list.getData();
      utils.passiveRestructuring.list.setData(undefined, (old) =>
        (old ?? []).filter((r) => r.id !== id),
      );
      return { prevData };
    },
    onError: (err, _deletedRecord, ctx) => {
      if (ctx?.prevData)
        utils.passiveRestructuring.list.setData(undefined, ctx.prevData);
      toast.error(`Erro ao excluir: ${err.message}`);
    },
    onSuccess: () => toast.success("Registro excluído!"),
    onSettled: () => utils.passiveRestructuring.list.invalidate(),
  });

  const [editingRecord, setEditingRecord] =
    useState<PassiveRestructuring | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (values: typeof defaultRecordValues) => {
    const payload = {
      ...values,
      demandId: demandId,
      lastPayment: values.lastPayment ? new Date(values.lastPayment) : undefined,   
      debtAmount: values.debtAmount ? Number(values.debtAmount) : 0,
      financialBalance: values.financialBalance ? Number(values.financialBalance) : 0,      
      installments: values.installments ? Number(values.installments) : 0,            
      completionDate: values.completionDate ? new Date(values.completionDate) : undefined,      
    }
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

  const columns: TableColumn<PassiveRestructuring>[] = [
    {
      name: "Registrado em",
      selector: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              minute: "2-digit",
              hour: "2-digit",
          })
          : "",
      sortable: true,
    },    
    {
      name: "Banco",
      selector: (row) => row.bank?.name ?? "",
      sortable: true,
    },
    {
      name: "Operação",
      selector: (row) => row.operation?.name ?? "",
      sortable: true,
    },
    {
      name: "Valor da divida",
      selector: (row) => row.debtAmount?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) ?? "",
      sortable: true,
    },    
    {
      name: "Registrato",
      selector: (row) => row.financialBalance?.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) ?? "",
      sortable: true,
    },
    {
      name: "Dt. do ultimo pagamento",
      selector: (row) =>
        row.createdAt
          ? new Date(row.lastPayment).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
          })
          : "",
      sortable: true,
    },        
    {
      name: "Dias em atraso",
      selector: (row) => {
        const diff = calcularDiferencaEmDiasOuMeses(new Date(), new Date(row.lastPayment), false);

        return diff
      } 
    },        
    {
      name: "Meses em atraso",
      selector: (row) => {
        const diff = calcularDiferencaEmDiasOuMeses(new Date(), new Date(row.lastPayment), true);

        return diff
      } 
    },  
    {
      name: "Classificação",
      selector: (row) => row?.recoveryType.name ?? "",
      sortable: true,
    },                  
    {
      name: "Status",
      cell: (row) => {
        const s = statusMap[row.status] ?? {
          label: row.status,
          color: "",
          icon: null,
        };
        return (
          <Badge
            className={`flex items-center rounded-full px-2 py-1 ${s.color}`}
          >
            {s.icon}
            {s.label}
          </Badge>
        );
      },
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
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="flex w-[180px] gap-2"
            variant="secondary"
            onClick={() => setEditingRecord(null)}
          >
            <Plus className="h-4 w-4" /> Novo Passivo
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl">
          <ScrollArea className="max-h-[50vh] pr-4">
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? "Editar Passivo" : "Novo Passivo"}
              </DialogTitle>
            </DialogHeader>

            <PassiveRestructuringForm
              defaultValues={editingRecord ?? defaultRecordValues}
              onSubmit={handleSubmit}
              isLoading={createRecord.isPending || updateRecord.isPending}
              banks={banks}
              operations={operations}
              recoveryTypes={recoveryTypes}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <DataTableApp
        columns={columns}
        data={records ?? []}
        urlReport="/api/reports/passive-restructuring"
      />
    </>
  );
}

function calcularDiferencaEmDiasOuMeses(data1: Date, data2: Date, meses: boolean): number {
  const milissegundosPorDia = 1000 * 60 * 60 * 24; // 1 dia em milissegundos
  const diferencaEmMilissegundos = Math.abs(data2.getTime() - data1.getTime()); // Diferença absoluta em milissegundos
  const diferencaEmDias = diferencaEmMilissegundos / milissegundosPorDia;

  if (meses) {
    return Math.floor(diferencaEmDias / 30);
  }

  return diferencaEmDias.toFixed(0);
}
