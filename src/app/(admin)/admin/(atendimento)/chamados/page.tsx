import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { ButtonModal } from "./components/buttonModal";
import { columns } from "./components/columns";

export default async function ChamadosPage() {
    const session = await auth();
    const ordemServicos = await api.ordemServico.getOrdemServicos();

    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    return (
        <PageLayout
            index={false}
            link={'/admin'}
            label={'Chamados (AGETEC)'}
            description={'Listagem de chamados abertos na AGETEC'}
            notBreadcrumb={false}
        >
            <ButtonModal action={'Nova Ordem de Serviço'} data={null}  />            
            <DataTableApp columns={columns} data={ordemServicos} />
        </PageLayout>
    );
}




