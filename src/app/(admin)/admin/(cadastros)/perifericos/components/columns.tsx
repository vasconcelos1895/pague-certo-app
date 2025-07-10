"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, File, FileText, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Periferico } from "@prisma/client"
import { ButtonModal } from "./buttonModal"
import { TableColumn } from "react-data-table-component"


export const columns: TableColumn<Periferico>[] = [ 
  {
    name: "ID",
    selector: row => row.id,
    sortable: true,
    width: '100px'
  },
  {
    name: "Descrição",
    selector: row => row.descricao,
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