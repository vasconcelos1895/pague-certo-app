import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { ButtonModal } from "./components/buttonModal";
import { columns } from "./components/columns";

export default async function DetalhesAtaPage({ params }:{ params: { id: string } }) {
    const { id } = params;
    const session = await auth();
    const detalhes = await api.detalhesAta.getDetalhesAtaById({ id: Number(id) })
    
    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    return (
        <PageLayout
            index={false}
            link={'/admin/atas-compras'}
            label={`${detalhes[0]?.ata ? detalhes[0]?.ata.assunto : 'Ata n. ' + id.toString()}`}
            description={'Histório de movimentações do processo'}
            notBreadcrumb={false}
        >   
        <div className="flex flex-col space-y-5">
            <Card>
                <CardHeader>
                    <CardTitle>{detalhes[0]?.ata.descricao}</CardTitle>
                    <CardDescription>Histórico de movimentação</CardDescription>
                </CardHeader>
                <CardContent>
                    <ButtonModal action={'Nova Movimentação'} data={null} ataId={id} />            
                    <DataTableApp columns={columns} data={detalhes} />                    
                </CardContent>
            </Card>
        </div>            
        </PageLayout>
    );
}




