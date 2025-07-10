"use client"

//import type { ColumnDef } from "@tanstack/react-table"
import { TableColumn } from "react-data-table-component"
import { ArrowUpDown, File, FileText, MoreHorizontal, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { PastaFuncional } from "@prisma/client"
import { ButtonModal } from "./buttonModal"


export const columns: TableColumn<PastaFuncional>[] = [ 
  {
    name: "ID",
    selector: row => row?.id,
    wrap: true,
    sortable: true
  },
  {    
    selector: row => row?.nome, 
    name: "nome",    
    wrap: true,
    sortable: true,
  },
  {    
    selector: row => row?.matricula,
    name: "Matrícula",
    wrap: true,
    sortable: true,
  },  
  {    
    selector: row => row?.envelope?.descricao,
    name: "Envelope",
    wrap: true,
    sortable: true,
  },  
  {    
    selector: row => row?.observacao,    
    name: "Observação",
    wrap: true,
    sortable: true,
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