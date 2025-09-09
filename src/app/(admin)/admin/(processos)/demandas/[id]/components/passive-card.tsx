'use client'; 

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { PassiveRestructuring } from "@prisma/client";
import { Ban, CheckCircle2, Clock, MoreHorizontalIcon, PauseCircle } from "lucide-react";
import { ButtonModal } from "./button-modal";


const statusMap: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  NAO_INICIADO: {
    label: "Não iniciado",
    color: "bg-gray-200 text-gray-800",
    icon: <Clock className="mr-1 h-4 w-4" />,
  },
  EM_ANDAMENTO: {
    label: "Em andamento",
    color: "bg-blue-200 text-blue-800",
    icon: <MoreHorizontalIcon className="mr-1 h-4 w-4" />,
  },
  CONCLUIDO: {
    label: "Concluído",
    color: "bg-green-200 text-green-800",
    icon: <CheckCircle2 className="mr-1 h-4 w-4" />,
  },
  SUSPENSO: {
    label: "Suspenso",
    color: "bg-yellow-200 text-yellow-800",
    icon: <PauseCircle className="mr-1 h-4 w-4" />,
  },
  CANCELADO: {
    label: "Cancelado",
    color: "bg-red-200 text-red-800",
    icon: <Ban className="mr-1 h-4 w-4" />,
  },
};


function calcularDiferencaEmDiasOuMeses(data1: Date, data2: Date, meses: boolean): number {
  const milissegundosPorDia = 1000 * 60 * 60 * 24; // 1 dia em milissegundos
  const diferencaEmMilissegundos = Math.abs(data2.getTime() - data1.getTime()); // Diferença absoluta em milissegundos
  const diferencaEmDias = diferencaEmMilissegundos / milissegundosPorDia;

  if (meses) {
    return Math.floor(diferencaEmDias / 30);
  }

  return diferencaEmDias.toFixed(0);
}



export default function PassiveCard({passiveRestructuring}: {passiveRestructuring: PassiveRestructuring[]}): JSX.Element {
    return (
        passiveRestructuring?.map((p,index) => (<>
            <Separator className="my-4"/>               
            <div className="flex justify-between">
                <div className={`flex justify-center items-center text-sm w-8 h-8 rounded-full border ${statusMap[p.status].color}`}>{index + 1}</div>
                <ButtonModal data={p} action="Atualizar" demandId={p.demandId} />
            </div>
            <div key={p.id}  className="flex flex-col gap-2 p-4 m-3 ">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Registrado em</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {p.createdAt
                                ? new Date(p.createdAt).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    minute: "2-digit",
                                    hour: "2-digit",
                                })
                                : ""}
                        </span>
                    </div>                         
                    <div className="flex flex-col space-y-1.5">
                        <span className="text-sm font-medium leading-none">Operação</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {p.operation?.name}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Banco</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {p.bank?.name}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Valor da divida</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {p.debtAmount?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Registrato</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {p.financialBalance?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Dt. do ultimo pagamento</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {p.lastPayment
                                ? new Date(p.lastPayment).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })
                                : ""}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Dias em atraso</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {calcularDiferencaEmDiasOuMeses(new Date(), new Date(p.lastPayment), false)}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Meses em atraso</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {calcularDiferencaEmDiasOuMeses(new Date(), new Date(p.lastPayment), true)}
                        </span>
                    </div>

                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Tipo de Recuperação</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {p.recoveryType?.name}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">% Provisionado</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            CALCULADO
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Valor Provisionado pelo Banco</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            CALCULADO
                        </span>
                    </div>                    
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Prejuizo</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            CALCULADO
                        </span>
                    </div>           
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Proposta de Acordo</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {p.settlementProposal}
                        </span>
                    </div>         
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Acordo Final</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {p.finalAgreement}
                        </span>
                    </div>         
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Plano de Pagamento</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {p.paymentPlan}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Qtde de Parcelas</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {p.installments}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Valor Parcela</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            CALCULADO 
                        </span>
                    </div>            
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Alçada</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {p.authority}
                        </span>
                    </div>              
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Escritório</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {p.office}
                        </span>
                    </div>           
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Observação</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {p.Note}                                                 
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Dt. Conclução</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {p.completionDate
                                ? new Date(p.completionDate).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })
                                : ""}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Tempo no Escritório</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            CALCULADO
                        </span>
                    </div>           
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Redução da Dívida</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            CALCULADO
                        </span>
                    </div>           
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Proveito Econômico</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            CALCULADO
                        </span>
                    </div>                                                                     
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Situação</span>
                        <span className="text-sm font-medium leading-none text-muted-pd">
                            <Badge
                                className={`flex items-center rounded-full px-2 py-1 ${statusMap[p.status]?.color}`}
                            >
                                {statusMap[p.status]?.icon}
                                {statusMap[p.status]?.label}
                            </Badge>
                        </span>
                    </div>

            
                </div>
            </div>   
        </>))
    );
}
