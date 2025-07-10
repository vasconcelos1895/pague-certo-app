"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, File, FileText, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Monitor, Periferico } from "@prisma/client"
import { ButtonModal } from "./buttonModal"
import { TableColumn } from "react-data-table-component"


export const columns: TableColumn<Monitor>[] = [ 
  {
    name: "ID",
    selector: row => row.id,
    sortable: true,
  },
  {
    name: "Sigla",
    selector: row => row?.setor?.sigla,  
  },
  {
    name: "Inventário",
    selector: row => row.inventario,
    sortable: true,    
  },  
  {
    name: "Marca",
    selector: row => row.marca,
    sortable: true,    
  },    
  {
    name: "Ações",
    cell: row => {
      const monitor = row
 
      return (
        <ButtonModal data={monitor} />
      )
    },
  }  
];