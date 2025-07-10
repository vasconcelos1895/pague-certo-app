"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { AlertCircle, ArrowUpDown, CheckCircle, Clock, File, FileText, MoreHorizontal, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Pedido } from "@prisma/client"
import { ButtonModal } from "./buttonModal"
import { formatDate  } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { TableColumn } from "react-data-table-component"
import { ButtonDelete } from "./buttonDelete"


export const columns: TableColumn<Pedido>[] = [ 
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
  },
  {
    name: "Servidor",
    selector: row => row?.servidor,      
  },
  {
    name: "Origem",
    selector: row => row?.origem,      
  },  
  {
    name: "Ofício",
    selector: row => row?.oficio,      
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