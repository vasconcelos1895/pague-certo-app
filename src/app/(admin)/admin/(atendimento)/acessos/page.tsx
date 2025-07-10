import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { ButtonModal } from "./components/buttonModal";
import { columns } from "./components/columns";

export default async function AcessoPage() {
    const session = await auth();
    const pedidos = await api.pedido.getPedidos();
    const sistemas = await api.sistema.getSistemas();

    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    return (
        <PageLayout
            index={false}
            link={'/admin'}
            label={'Acessos'}
            description={'Controle das solicitações de acesso a rede, sistemas, email, etc.'}
            notBreadcrumb={false}
        >
            <ButtonModal action={'Novo Pedido de Acesso'} data={null} sistemas={sistemas}/>          
            <DataTableApp columns={columns} data={pedidos} />
        </PageLayout>
    );
}




