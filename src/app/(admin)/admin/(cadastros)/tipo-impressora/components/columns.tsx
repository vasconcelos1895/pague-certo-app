"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, File, FileText, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ImpressoraTipo, Setor, Sistema } from "@prisma/client"
import { ButtonModal } from "./buttonModal"
import { TableColumn } from "react-data-table-component"


export const columns: TableColumn<ImpressoraTipo>[] = [ 
  {
    name: "ID",
    selector: row => row?.id,
    sortable: true,    
  },
  {
    name: "Descrição",
    selector: row => row?.descricao,
    sortable: true, 
  },
  {
    name: "Tipo",
    selector: row => row?.tipo,
    sortable: true,        
  },  
  {
    name: "Descrição",
    selector: row => row?.valor,
    sortable: true,    
  },    
  {
    name: "Franq. (PB)",
    selector: row => row?.franquiaPb,
    sortable: true,        
  },      
  {
    name: "Franq. (Col.)",
    selector: row => row?.franquiaCl,
    sortable: true,    
  },      
  {
    name: "Ações",
    cell: row => {
      const customer = row
 
      return (
        <ButtonModal data={row} />            
      )
    },
  }  
];