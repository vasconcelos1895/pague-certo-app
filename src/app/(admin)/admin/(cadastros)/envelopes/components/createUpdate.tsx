"use client";

import GenericForm from "@/components/GenericForm";
import { api } from "@/trpc/react";
import { Envelope } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const envelopeSchema = z.object({
  id: z.string().nullable(),
  descricao: z.string().min(1, "Descrição é obrigatória"),
});

export default function EnvelopeCreateUpdate({
  data,
  onSuccess,
}: {
  data: Envelope | null,
  onSuccess?: () => void,
}) {
  const router = useRouter();

  const createRecord = api.envelope.createEnvelope.useMutation({
    onSuccess() {
      toast.success("GETT-HELP-DESK", {
        description: "Envelope salvo com sucesso",
        position: 'bottom-right'
      })
      onSuccess?.();
      router.refresh();
    },
    onError(error) {
      // Verifica se é erro de duplicidade através da code
      if ((error as any).code === "DUPLICATE_DESCRIPTION") {
        toast.error("Já existe um envelope com essa descrição. Por favor, use outra.");
        // Ou só ignore o erro para não mostrar nada:
        // return;
      } else {
        console.error('Erro interno.', error.message);
        alert(`Erro ao salvar envelope: ${error.message}`);
      }
    }
  });

  const updateRecord = api.envelope.updateEnvelope.useMutation({
    onSuccess() {
      toast.success("GETT-HELP-DESK", {
        description: "Envelope atualizado com sucesso",
        position: 'bottom-right'
      })
      onSuccess?.();
      router.refresh();
    },
    onError(error) {
      // Verifica se é erro de duplicidade através da code
      if ((error as any).code === "DUPLICATE_DESCRIPTION") {
        toast.error("Já existe um envelope com essa descrição. Por favor, use outra.");
        // Ou só ignore o erro para não mostrar nada:
        // return;
      } else {
        console.error('Erro interno.', error.message);
        alert(`Erro ao salvar envelope: ${error.message}`);
      }
    }
  });

  const onSubmit = async (dataForm: z.infer<typeof envelopeSchema>) => {
    if (dataForm.id) {
      await updateRecord.mutateAsync({
        id: parseInt(dataForm.id),
        descricao: dataForm.descricao,
      });
    } else {
      await createRecord.mutateAsync({
        descricao: dataForm.descricao,
      });
    }
  };

  return (
    <div>
      <GenericForm
        schema={envelopeSchema}
        onSubmit={onSubmit}
        defaultValues={{
          id: data?.id.toString() ?? '',
          descricao: data?.descricao ?? '',
        }}
        fields={{
          id: { label: "ID", type: "hidden" },
          descricao: { label: "Descrição", type: "text", placeholder: "Descrição do envelope" },
        }}
        submitLabel={data ? 'Atualizar' : 'Salvar'}
      />
    </div>
  );
}
