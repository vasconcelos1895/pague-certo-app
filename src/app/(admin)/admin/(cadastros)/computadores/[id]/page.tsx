import { DataTable } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import DriveList from "./components/drive-list";

export default async function ComputadorPage({ params }:{ params: { id: string } }) {
    const { id } = params;
    const session = await auth();
    const computador = await api.computador.getComputadorById({ id: id });    
    
    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    console.log('computador',computador)

    return (
        <PageLayout
            index={false}
            link={'/admin/computadores'}
            label={`Computador ID n. ${computador?.id.toString()}`}
            description={'Listagem de computadores do órgão'}
            notBreadcrumb={false}
        >   
        <div className="flex flex-col space-y-5">
            <Card>
                <CardHeader>
                    <CardTitle>Computador ID n. {computador?.id.toString()}</CardTitle>
                    <CardDescription>Detalhes do equipamento</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row gap-2">
                        <div>Responsável:</div>
                        <div>{computador?.responsavel}</div>
                    </div>
                    <div className="flex flex-row gap-2">
                        <div>Sigla:</div>
                        <div>{computador?.setor.sigla}</div>
                    </div>        
                    <div className="flex flex-row gap-2">
                        <div>Patrimônio:</div>
                        <div>{computador?.patrimonio}</div>
                    </div>                          
                    <div className="flex flex-row gap-2">
                        <div>Inventário:</div>
                        <div>{computador?.inventario}</div>
                    </div>                                                    
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Especificacões</CardTitle>
                    <CardDescription>Visualize os arquivos direto do drive</CardDescription>
                </CardHeader>                
                <CardContent>
                    <div className="flex flex-row gap-2">
                        <div>Descrição:</div>
                        <div>{computador?.Especificacao?.[0]?.descricao}</div>
                    </div>  
                    {/* {session &&
                        <DriveList />                                                 
                    }                     */}
                </CardContent>
            </Card>            
            {/* <ButtonModal action={'Novo Periférico'} data={null}  /> */}
        </div>            
        </PageLayout>
    );
}




