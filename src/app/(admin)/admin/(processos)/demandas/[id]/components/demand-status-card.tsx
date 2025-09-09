"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, MoreHorizontalIcon } from "lucide-react";

type DemandStatus = "NAO_INICIADO" | "EM_ANDAMENTO" | "CONCLUIDO";

const statusMap: Record<
  DemandStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  NAO_INICIADO: {
    label: "Não iniciado",
    color: "bg-gray-50 border-gray-200 text-gray-800",
    icon: <Clock className="h-6 w-6" />,
  },
  EM_ANDAMENTO: {
    label: "Em andamento",
    color: "bg-blue-50 border-blue-200 text-blue-800",
    icon: <MoreHorizontalIcon className="h-6 w-6" />,
  },
  CONCLUIDO: {
    label: "Concluído",
    color: "bg-green-50 border-green-200 text-green-800",
    icon: <CheckCircle2 className="h-6 w-6" />,
  },
};

interface DemandStatusCardProps {
  status: DemandStatus;
}

export function DemandStatusCard({ status }: DemandStatusCardProps) {
  const s = statusMap[status];

  return (
      <Card className={`@container/card ${s.color}`}>
        <CardHeader>
          <CardDescription>Situação</CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
            {s.label}
          </CardTitle>
          <CardAction>
              {s.icon}
          </CardAction>
        </CardHeader>
      </Card>
  );
}
