"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, File, FileText, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { Envelope } from "@prisma/client"
import { ButtonModal } from "./buttonModal"
import { TableColumn } from "react-data-table-component"


export const columns: TableColumn<Envelope>[] = [ 
  {
    name: "ID",
    selector: row => row?.id,
    sortable: true,
  },
  {
    name: "Descricao",
    selector: row => row?.descricao,  
  },
  {
    name: "Ações",
    cell: row => {
      const ramal = row
 
      return (
        <ButtonModal data={ramal} />
      )
    },
  }  
];