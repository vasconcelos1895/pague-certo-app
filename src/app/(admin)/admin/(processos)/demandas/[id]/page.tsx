import PageLayout from "@/components/PageLayout";
import { api } from "@/trpc/server";
import { DemandStatusCard } from "./components/demand-status-card";
import { DemandPriorityCard } from "./components/demand-priority-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function Page({params}: {params: {id: string}}) {
  const { id } = params
  const demand = await api.demand.getById({id});

  // ✅ Optimistic Cr

  return (
    <PageLayout
      index={false}
      link={"/admin/demandas"}
      label={`Reestruturação de Passivo`}
      description={`Análise e reestruturação de passivo do cliente.`}
      notBreadcrumb={false}
    >
        {demand && (<div className="flex flex-col gap-4">
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

                </CardContent>
            </Card>            
        </div>)}
    </PageLayout>
  );
}