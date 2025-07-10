"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, File, FileText, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Periferico, Telefone } from "@prisma/client"
import { ButtonModal } from "./buttonModal"
import { TableColumn } from "react-data-table-component"


export const columns: TableColumn<Telefone>[] = [ 
  {
    name: "ID",
    selector: row => row?.id,
    sortable: true,
  },
  {
    name: "Sigla",
    selector: row => row?.setor?.sigla,  
  },
  {
    name: "Responsável",
    selector: row => row?.responsavel,
    sortable: true,
  },  
  {
    name: "Patrimônio",
    selector: row => row?.patrimonio,
    sortable: true,
  },  
  {
    name: "Ramal",
    selector: row => row?.ramal,
    sortable: true,
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