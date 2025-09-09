import PageLayout from "@/components/PageLayout";
import { api } from "@/trpc/server";
import { DemandStatusCard } from "./components/demand-status-card";
import { DemandPriorityCard } from "./components/demand-priority-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ButtonModal } from "./components/button-modal";
import { Badge } from "@/components/ui/badge";
import { Ban, Calculator, CheckCircle2, Clock, MoreHorizontalIcon, PauseCircle } from "lucide-react";
import PassiveCard from "./components/PassiveCard/passive-card";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const demand = await api.demand.getById({id});
  const passives = await api.passiveRestructuring.getByDemandId({demandId: demand?.id});

  return (
    <PageLayout
      index={false}
      link={"/admin/demandas"}
      label={`Reestruturação de Passivo`}
      description={`Análise e reestruturação de passivo do cliente.`}
      notBreadcrumb={false}
    >
        {demand && 
        (<div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <DemandStatusCard status={demand.status} />             
                <DemandPriorityCard status={demand.priority} />   
            </div>

            <Separator />

            <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Dados do Cliente</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Informações básicas do cliente associado à demanda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
                            <p className="text-base font-semibold">{demand.client.name}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Documento</h3>
                            <p className="text-base font-semibold">{demand.client.document}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                            <p className="text-base font-semibold">{demand.client.email}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Telefones</h3>
                            <p className="text-base font-semibold">{demand.client.primaryPhone} {demand.client.secondaryPhone ? ` - ${demand.client.secondaryPhone}` : ''}</p>
                        </div>                        
                    </div>
                </CardContent>
            </Card>

            <Separator />            

            <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Passivos</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Lista de passivos associados à demanda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ButtonModal action="Novo Registro" data={null} demandId={demand.id}/>
                    <Separator className="my-4" />
                    <p className="text-xs mb-1 ml-1 text-muted-foreground">
                        LEGENDA: 
                    </p>
                    <div className="flex gap-2">
                        {statusMap?.map((sm, i) => (
                            <Badge
                                key={i}
                                className={`flex items-center rounded-sm px-2 py-1 ${sm?.color}`}
                            >
                                {sm?.icon}
                                {sm?.label}
                            </Badge>
                        ))}
                    </div>
                    <PassiveCard passiveRestructuring={passives} />
                </CardContent>
            </Card>            
        </div>)}
    </PageLayout>
  );
}

const statusMap: { label: string; color: string; icon: React.ReactNode }[] = [ 
  {
    label: "Não iniciado",
    color: "bg-gray-200 text-gray-800",
    icon: <Clock className="mr-1 h-4 w-4" />,
  },
  {
    label: "Em andamento",
    color: "bg-blue-200 text-blue-800",
    icon: <MoreHorizontalIcon className="mr-1 h-4 w-4" />,
  },
  {
    label: "Concluído",
    color: "bg-green-200 text-green-800",
    icon: <CheckCircle2 className="mr-1 h-4 w-4" />,
  },
  {
    label: "Suspenso",
    color: "bg-yellow-200 text-yellow-800",
    icon: <PauseCircle className="mr-1 h-4 w-4" />,
  },
  {
    label: "Cancelado",
    color: "bg-red-200 text-red-800",
    icon: <Ban className="mr-1 h-4 w-4" />,
  },
  ,
  {
    label: "Campo Calculado",
    color: "bg-purple-200 text-purple-800",
    icon: <></>,
  },  
];
