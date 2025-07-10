

"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, File, FileText, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ImpressoraTipo, Sistema } from "@prisma/client"
import { ButtonModal } from "./buttonModal"
import { TableColumn } from "react-data-table-component"


export const columns: TableColumn<Sistema>[] = [ 
  {
    name: "ID",
    selector: row => row?.id,
    sortable: true,
  },
  {
    name: "Nome",    
    selector: row => row?.nome,
    sortable: true,
  },
  {
    name: "Descrição",
    selector: row => row?.descricao,
    sortable: true,    
  },  
  {
    name: "Ações",
    cell: row => {
      const customer = row
 
      return (
        <ButtonModal data={row}  />
      )
    },
  }  
];