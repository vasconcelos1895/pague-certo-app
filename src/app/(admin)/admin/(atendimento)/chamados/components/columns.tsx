"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { AlertCircle, ArrowUpDown, CheckCircle, Clock, File, FileText, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Interno, Monitor, OrdemServico, Periferico } from "@prisma/client"
import { ButtonModal } from "./buttonModal"
import { formatDate  } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { TableColumn } from "react-data-table-component"
import { ButtonDelete } from "./buttonDelete"


export const columns: TableColumn<OrdemServico>[] = [ 
  {
    name: "ID",
    selector: row => row.id,
    sortable: true,
    width: '100px'
  },
  {
    name: "Sigla",
    selector: row => row?.setor?.sigla,  
    sortable: true,
  },
  {
    name: "Data Solicitação",
    selector: row => formatDate(new Date(row?.data), 'dd/MM/yyyy'),
    sortable: true,
  },  
  {
    name: "Hora",
    selector: row => row?.hora,      
  },
  {
    name: "n. OS",
    selector: row => row?.numero_os,          
    sortable: true,
  },    
  {
    name: "Situação",    
    sortable: true,    
    cell: row => {
      const situacao = row?.situacao?.toUpperCase();
  
      const situacaoConfig = {
        'PENDENTE': {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-300',
          icon: AlertCircle,
        },
        'EM ANDAMENTO': {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-300',
          icon: Clock,
        },
        'CONCLUÍDO': {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-300',
          icon: CheckCircle,
        },
        'DEFAULT': {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-300',
          icon: MoreHorizontal,
        }
      };
  
      const config = situacaoConfig[situacao] || situacaoConfig['DEFAULT'];
      const Icon = config.icon;
  
      return (
        <div 
          className={`
            inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
            ${config.bgColor} ${config.textColor} ${config.borderColor}
            border shadow-sm
          `}
        >
          <Icon size={16} className="mr-1" />
          {situacao.toLowerCase()}
        </div>
      );
    },
  },      
  {
    name: "Ações",
    cell: (row) => {
      return (
        <div className="flex gap-2">
          <ButtonModal data={row} />
          <ButtonDelete id={row.id} />
        </div>
      )
    },
  }  
];