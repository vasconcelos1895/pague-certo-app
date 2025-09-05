"use client"

//import type { ColumnDef } from "@tanstack/react-table"
import { TableColumn } from "react-data-table-component"
import { ArrowUpDown, File, FileText, MoreHorizontal, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Computador, Periferico } from "@prisma/client"
import { ButtonModal } from "./buttonModal"


export const columns: TableColumn<Computador>[] = [ 
  {
    name: "ID",
    selector: row => row?.id,
    wrap: true,
    sortable: true
  },
  {    
    selector: row => row?.setor.sigla, 
    name: "Sigla",    
    wrap: true,
    sortable: true,
  },
  {    
    selector: row => row?.patrimonio,
    name: "Patrimônio (PMCG)",
    wrap: true,
    sortable: true,
  },  
  {    
    selector: row => row?.inventario,
    name: "Inventário (AGETEC)",
    wrap: true,
    sortable: true,
  },  
  {    
    selector: row => row?.responsavel,    
    name: "Responsável",
    wrap: true,
    sortable: true,
  },    
  {
    name: "Ações",
    cell: row => {
      return (
        <Button size={'icon'} variant={'outline'} asChild>
          <Link href={`/admin/computadores/${row.id.toString()}`} ><Pencil className="w-4 h-4"/></Link>            
        </Button>
      )
    },
  }  
];