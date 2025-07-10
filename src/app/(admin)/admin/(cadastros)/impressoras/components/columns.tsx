"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, File, FileText, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Impressora, ImpressoraTipo, Periferico } from "@prisma/client"
import { ButtonModal } from "./buttonModal"
import { TableColumn } from "react-data-table-component"


export const columns: TableColumn<Impressora>[] = [ 
  {
    name: "ID",
    selector: row => row?.setor?.sigla, 
    sortable: true, 
  },
  {
    name: "Sigla",
    selector: row => row?.setor?.sigla,  
    sortable: true,
  },
  {
    selector: row => row?.impressoraTipo?.descricao,  
    name: "Tipo Impressora",
    sortable: true,
  },  
  {
    name: "n. Série",
    selector: row => row?.serie,  
    sortable: true,
  },    
  {
    name: "IP",
    selector: row => row?.ip,  
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