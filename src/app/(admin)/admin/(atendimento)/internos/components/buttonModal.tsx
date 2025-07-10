"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import CreateUpdate from "./createUpdate";
import { Interno, Monitor, Periferico, Setor, Sistema } from "@prisma/client";
import { api } from "@/trpc/react";

export function ButtonModal({ action, data }: { action?: string, data: Interno | null }) {
  const [open, setOpen] = useState(false);
  const { data: setores } = api.setor.getSetores.useQuery()

  return (
    <>
      {/* Botão que abre o dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className={`flex ${action ? 'w-[130px]' : 'w-[40px]'}  justify-start`}>
            <Button className="flex gap-2" variant={'secondary'}>
              {action
                ? <Plus className="w-4 h-4" />
                : <Pencil className="w-4 h-4" />
              }
              {action}
            </Button>
          </div>
        </DialogTrigger>

        <DialogContent
          className="
            max-w-lg
            max-h-[90vh]  // Altura máxima maior em dispositivos móveis
            md:max-h-[80vh] 
            flex 
            flex-col 
            overflow-hidden
          ">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Atendimento</DialogTitle>
            <DialogClose className="absolute top-3 right-3" />
          </DialogHeader>

          {/* Formulário dentro do dialog */}
          <div className="overflow-y-auto pr-2 flex-grow">
            <CreateUpdate data={data} onSuccess={() => setOpen(false)} setores={setores} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}