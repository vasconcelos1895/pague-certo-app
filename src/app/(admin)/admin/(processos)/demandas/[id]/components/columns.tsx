'use client';

import { Badge } from "@/components/ui/badge";
import type { PassiveRestructuring } from "@prisma/client";
import { Ban, CheckCircle2, Clock, MoreHorizontalIcon, PauseCircle } from "lucide-react";
import type { TableColumn } from "react-data-table-component";
import ButtonDelete from "./button-delete";
import { ButtonModal } from "./button-modal";


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



export const columns: TableColumn<PassiveRestructuring>[] = [
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
          <ButtonModal data={row} />
          <ButtonDelete data={row} />
        </div>
      ),
    },
  ];


function calcularDiferencaEmDiasOuMeses(data1: Date, data2: Date, meses: boolean): number {
  const milissegundosPorDia = 1000 * 60 * 60 * 24; // 1 dia em milissegundos
  const diferencaEmMilissegundos = Math.abs(data2.getTime() - data1.getTime()); // Diferença absoluta em milissegundos
  const diferencaEmDias = diferencaEmMilissegundos / milissegundosPorDia;

  if (meses) {
    return Math.floor(diferencaEmDias / 30);
  }

  return diferencaEmDias.toFixed(0);
}
