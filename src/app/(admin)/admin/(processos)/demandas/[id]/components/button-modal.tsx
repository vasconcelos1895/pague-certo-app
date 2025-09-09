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
import CrudForm from "./crud-form";
import type { PassiveRestructuring } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ButtonModal({action ,data, demandId}:{action?: string, data:PassiveRestructuring | null, demandId:string}) {
  const [open, setOpen] = useState(false);

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
        <ScrollArea className="max-h-[50vh] pr-4">
          <DialogHeader>
            <DialogTitle>Reestruturação Passivo</DialogTitle>
            <DialogClose className="absolute top-3 right-3" />
          </DialogHeader>

          {/* Formulário dentro do dialog */}
          <CrudForm data={data} demandId={demandId} onSuccess={() => setOpen(false)} />
        </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}