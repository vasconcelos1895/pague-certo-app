"use client";

import { useState } from "react";
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
import type { PastaFuncional } from "@prisma/client";
import { api } from "@/trpc/react";

export function ButtonModal({action ,data}:{action?: string, data:PastaFuncional | null}) {
  const [open, setOpen] = useState(false);
  const { data: envelopes } = api.envelope.getEnvelopes.useQuery()  

  return (
    <>
      {/* Botão que abre o dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <div  className="flex w-[130px] justify-start">
                <Button className="flex gap-2" variant={'secondary'}>
                    {action
                        ? <Plus className="w-4 h-4"/>
                        : <Pencil className="w-4 h-4"/>
                    }
                    {action}
                </Button>
            </div>
        </DialogTrigger>

        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Envelope</DialogTitle>
            <DialogClose className="absolute top-3 right-3" />
          </DialogHeader>

          {/* Formulário dentro do dialog */}
          <CreateUpdate data={data} onSuccess={() => setOpen(false)} envelopes={envelopes} />
        </DialogContent>
      </Dialog>
    </>
  );
}