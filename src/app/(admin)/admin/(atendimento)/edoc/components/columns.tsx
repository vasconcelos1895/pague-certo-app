"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { AlertCircle, ArrowUpDown, CheckCircle, Clock, File, FileText, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { AtendimentoEdoc } from "@prisma/client"
import { ButtonModal } from "./buttonModal"
import { formatDate } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { TableColumn } from "react-data-table-component"


export const columns: TableColumn<AtendimentoEdoc>[] = [
  {
    name: "ID",
    selector: row => row.id,
    sortable: true,
    width: '100px'
  },
  {
    name: "Órgão",
    selector: row => row.orgao,
    sortable: true,
  },
  {
    name: "Servidor",
    selector: row => row.servidor,
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
    name: "Situação",       
    sortable: true,     
    cell: row => {
      const situacao = row.situacao.toUpperCase();
  
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
            inline-flex items-center gap-2 px-2 py-0.5 rounded-full text-sm font-medium
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
    cell: row => {
      return (
        <ButtonModal data={row} />
      )
    },
  }
];