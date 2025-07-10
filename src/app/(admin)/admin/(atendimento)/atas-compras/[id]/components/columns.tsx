"use client"

import type { DetalhesAta } from "@prisma/client"
import { ButtonModal } from "./buttonModal"
import { formatDate  } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { TableColumn } from "react-data-table-component"
import { ButtonDelete } from "./buttonDelete"


export const columns: TableColumn<DetalhesAta>[] = [ 
  {
    name: "ID",
    selector: row => row.id,
    sortable: true,
    width: '100px'
  },
  {
    name: "Data",
    selector: row => formatDate(new Date(row?.data), 'dd/MM/yyyy'),
    sortable: true,
    width: '120px'    
  },  
  {
    name: "Descrição",
    selector: row => row?.descricao,          
    sortable: true,
    wrap: true
  },    
  {
    name: "Ações",
    cell: (row) => {
      return (
        <div className="flex gap-2">
          <ButtonModal data={row} />
          <ButtonDelete id={row.id} />
        </div>
      )
    },
    width: '150px'        
  }  
];
