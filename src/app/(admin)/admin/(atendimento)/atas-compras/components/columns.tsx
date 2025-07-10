"use client"

import { AlertCircle, ArrowUpDown, CheckCircle, Clock, Edit, File, FileText, ListChecks, MoreHorizontal, Trash } from "lucide-react"
import type { Ata } from "@prisma/client"
import { ButtonModal } from "./buttonModal"
import { formatDate  } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { TableColumn } from "react-data-table-component"
import { ButtonDelete } from "./buttonDelete"
import { Button } from "@/components/ui/button";
import Link from "next/link";


export const columns: TableColumn<Ata>[] = [ 
  {
    name: "ID",
    selector: row => row.id,
    sortable: true,
    width: '100px'
  },
  {
    name: "Data",
    selector: row => formatDate(new Date(row?.data), 'dd/MM/yyyy'),
    sortable: true,
    width: '120px'    
  },  
  {
    name: "Assunto",
    selector: row => row?.assunto,     
    wrap: true 
  },
  {
    name: "Descrição",
    selector: row => row?.descricao,          
    sortable: true,
    wrap: true
  },    
  {
    name: "Situação",    
    sortable: true,    
    cell: row => {
      const situacao = (row.status ?? '').trim().toUpperCase();
  
      const situacaoConfig = {
        'FINALIZADO': {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-300',
          icon: AlertCircle,
        },
        'ABERTO': {
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

      console.log('situacao ata,',situacaoConfig, situacao)
  
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
    width: '180px'
  },      
  {
    name: "Ações",
    cell: (row) => {
      return (
        <div className="flex gap-2">
          <ButtonModal data={row} />
          <Button variant={'secondary'} asChild>
            <Link href={`/admin/atas-compras/${row.id.toString()}`}>
              <ListChecks />
            </Link>
          </Button>
          <ButtonDelete id={row.id} />
        </div>
      )
    },
    width: '180px'    
  }  
];
