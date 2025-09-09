'use client';

import { Badge } from "@/components/ui/badge";
import type { AdditionalProvisionLevel, PassiveRestructuring } from "@prisma/client";
import { Ban, Calculator, CheckCircle2, Clock, Equal, MoreHorizontalIcon, PauseCircle, Plus } from "lucide-react";
import { ButtonModal } from "../button-modal";
import { api } from "@/trpc/react";
import { Separator } from "@/components/ui/separator";


export const statusMap: Record<
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


function calcularDiferencaEmDiasOuMeses(data1: Date, data2: Date, meses: boolean): number | string {
    // Normaliza as datas para UTC zerando hora, minuto, etc.
    const d1 = Date.UTC(data1.getUTCFullYear(), data1.getUTCMonth(), data1.getUTCDate());
    const d2 = Date.UTC(data2.getUTCFullYear(), data2.getUTCMonth(), data2.getUTCDate());

    const milissegundosPorDia = 1000 * 60 * 60 * 24;
    const diferencaEmDias = Math.floor(Math.abs(d2 - d1) / milissegundosPorDia);

    if (meses) {
        return Math.floor(diferencaEmDias / 30); // bem aproximado
    }

    return diferencaEmDias;
}

function diferencaEmMesesEDias(data1: Date, data2: Date): string {
    // Garantir que data1 seja a menor
    let inicio = data1 < data2 ? data1 : data2;
    let fim = data1 < data2 ? data2 : data1;

    let anos = fim.getUTCFullYear() - inicio.getUTCFullYear();
    let meses = fim.getUTCMonth() - inicio.getUTCMonth();
    let dias = fim.getUTCDate() - inicio.getUTCDate();

    if (dias < 0) {
        // Pegar o último dia do mês anterior
        const ultimoDiaMesAnterior = new Date(
            fim.getUTCFullYear(),
            fim.getUTCMonth(),
            0
        ).getUTCDate();

        dias += ultimoDiaMesAnterior;
        meses -= 1;
    }

    if (meses < 0) {
        meses += 12;
        anos -= 1;
    }

    const totalMeses = anos * 12 + meses;

    // Montar string
    let partes: string[] = [];
    if (totalMeses > 0) {
        partes.push(`${totalMeses} ${totalMeses === 1 ? "mês" : "meses"}`);
    }
    if (dias > 0) {
        partes.push(`${dias} ${dias === 1 ? "dia" : "dias"}`);
    }

    return partes.length > 0 ? partes.join(" e ") : "0 dias";
}

function calcularAdicionalProvisionado(additionalProvisionLevel: AdditionalProvisionLevel[], recoveryType: string, diferencaEmDias: number | string) {
    const item = additionalProvisionLevel?.find(a => Number(diferencaEmDias) >= a.initialDeadline && Number(diferencaEmDias) <= a.finalDeadline)

    let recoveryTypeValue: number = 0

    if (item) {

        recoveryTypeValue = recoveryType.toString().trim() === 'C1' ? item.percentageC1
            : recoveryType.toString().trim() === 'C2' ? item.percentageC2
                : recoveryType.toString().trim() === 'C3' ? item.percentageC3
                    : recoveryType.toString().trim() === 'C4' ? item.percentageC4
                        : recoveryType.toString().trim() === 'C5' ? item.percentageC5 : 0
    }

    return recoveryTypeValue
}



export default function ItemCard({ passiveRestructuring, additionalProvisionLevel, index }:
    { passiveRestructuring: PassiveRestructuring, additionalProvisionLevel: AdditionalProvisionLevel[] | undefined, index: number }) {
    const diferencaEmDias = calcularDiferencaEmDiasOuMeses(new Date(), new Date(passiveRestructuring.lastPayment), false)
    const diferencaEmMeses = calcularDiferencaEmDiasOuMeses(new Date(), new Date(passiveRestructuring.lastPayment), true)
    const percentualAdditonal = calcularAdicionalProvisionado(additionalProvisionLevel, passiveRestructuring?.recoveryType.name, diferencaEmDias)
    const tempoEscritorio = diferencaEmMesesEDias(new Date(), new Date(passiveRestructuring.createdAt))
    const valorProvisionadoBanco = (passiveRestructuring.debtAmount * percentualAdditonal) / 100
    const paymentPlan = passiveRestructuring.debtAmount - valorProvisionadoBanco

    return (
        <div key={index}>
            <Separator className="my-4" />
            <div className="flex justify-between">
                <div className={`flex justify-center items-center text-sm w-8 h-8 rounded-full border ${statusMap[passiveRestructuring.status].color}`}>{index + 1}</div>
                <ButtonModal data={passiveRestructuring} action="Atualizar" demandId={passiveRestructuring.demandId} />
            </div>
            <div className="flex flex-col gap-2 p-4 m-3 ">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Registrado em</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {passiveRestructuring.createdAt
                                ? new Date(passiveRestructuring.createdAt).toLocaleDateString("pt-BR", {
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
                            {passiveRestructuring.operation?.name}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Banco</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {passiveRestructuring.bank?.name}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Valor da divida</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {passiveRestructuring.debtAmount?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Registrato</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {passiveRestructuring.financialBalance?.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Dt. do ultimo pagamento</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {passiveRestructuring.lastPayment
                                ? new Date(passiveRestructuring.lastPayment).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    timeZone: "UTC"
                                })
                                : ""}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Dias em atraso</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            <Badge className="flex items-center rounded-sm px-2 py-1 bg-purple-200 text-purple-800">
                                {diferencaEmDias}
                            </Badge>
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Meses em atraso</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            <Badge className="flex items-center rounded-sm px-2 py-1 bg-purple-200 text-purple-800">
                                {diferencaEmMeses}
                            </Badge>                                                        
                        </span>
                    </div>

                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Tipo de Recuperação</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {passiveRestructuring.recoveryType?.name}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Provisionado</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">                            
                            <Badge className="flex items-center rounded-sm px-2 py-1 bg-purple-200 text-purple-800">
                                {percentualAdditonal}%
                            </Badge>                                                                                    
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Valor Provisionado pelo Banco</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            <Badge className="flex items-center rounded-sm px-2 py-1 bg-purple-200 text-purple-800">
                                {valorProvisionadoBanco.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Badge>                                                                                                                     
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Prejuizo</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            <Badge className="flex items-center rounded-sm px-2 py-1 bg-purple-200 text-purple-800">
                                {percentualAdditonal >= 100 ? "SIM" : "NÃO"}
                            </Badge>                                                                                                                                                 
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Proposta de Acordo</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {passiveRestructuring.settlementProposal}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Acordo Final</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {passiveRestructuring.finalAgreement}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Plano de Pagamento</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            <Badge className="flex items-center rounded-sm px-2 py-1 bg-purple-200 text-purple-800">
                                {paymentPlan.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Badge>                                    
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Qtde de Parcelas</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {passiveRestructuring.installments}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Valor Parcela</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            <Badge className="flex items-center rounded-sm px-2 py-1 bg-purple-200 text-purple-800">
                                {passiveRestructuring.installments > 0
                                    ? (paymentPlan / passiveRestructuring.installments).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                    : "-"}
                            </Badge>                                                                                    
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Alçada</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {passiveRestructuring.authority}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Escritório</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {passiveRestructuring.office}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Observação</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {passiveRestructuring.Note}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Dt. Conclução</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">
                            {passiveRestructuring.completionDate
                                ? new Date(passiveRestructuring.completionDate).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    timeZone: "UTC"
                                })
                                : ""}
                        </span>
                    </div>
                    <div className="flex flex-col  space-y-1.5">
                        <span className="text-sm font-medium leading-none">Tempo no Escritório</span>
                        <span className="text-sm font-medium leading-none text-muted-foreground">                            
                            <Badge className="flex items-center rounded-sm px-2 py-1 bg-purple-200 text-purple-800">
                                {tempoEscritorio}
                            </Badge>                                 
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
                                className={`flex items-center rounded-sm px-2 py-1 ${statusMap[passiveRestructuring.status]?.color}`}
                            >
                                {statusMap[passiveRestructuring.status]?.icon}
                                {statusMap[passiveRestructuring.status]?.label}
                            </Badge>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
