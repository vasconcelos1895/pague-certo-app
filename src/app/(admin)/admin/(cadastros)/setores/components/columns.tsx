"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, File, FileText, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Setor } from "@prisma/client"
import { SetorManager } from "./setorManager"
import { TableColumn } from "react-data-table-component"


export const columns: TableColumn<Setor>[] = [ 
  {
    name: "ID",
    selector: row => row.id,
    sortable: true,
  },
  {
    name: "nome",
    selector: row => row.nome,
    sortable: true,    
  },  
  {
    name: "Sigla",
    selector: row => row?.sigla,
    sortable: true,    
  },
  {
    name: "Órgão",
    selector: row => row?.orgao,
    sortable: true,    
  },
  {
    name: "Ações",
    cell: row => {
      const customer = row
 
      return (
        <SetorManager data={row} />
      )
    },
  }  
];