"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowBigDownDash, ArrowBigUpDash, CheckCircle2, Clock, MoreHorizontalIcon, UnfoldVertical } from "lucide-react";

type DemandPriority = "BAIXA" | "MEDIA" | "ALTA";

const statusMap: Record<
  DemandPriority,
  { label: string; color: string; icon: React.ReactNode }
> = {
  BAIXA: {
    label: "Baixa",
    color: "border-yellow-200 text-yellow-800",
    icon: <ArrowBigDownDash className="h-4 w-4 mr-1" />,
  },
  MEDIA: {
    label: "Média",
    color: "border-orange-200 text-orange-800",
    icon: <UnfoldVertical className="h-4 w-4 mr-1" />,
  },
  ALTA: {
    label: "Alta",
    color: "border-red-200 text-red-800",
    icon: <ArrowBigUpDash className="h-4 w-4 mr-1" />,
  },
};

interface DemandPriorityCardProps {
  status: DemandPriority;
}

export function DemandPriorityCard({ status }: DemandPriorityCardProps) {
  const s = statusMap[status];

  return (
      <Card className={`@container/card ${s.color}`}>
        <CardHeader>
          <CardDescription>Prioridade</CardDescription>
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
