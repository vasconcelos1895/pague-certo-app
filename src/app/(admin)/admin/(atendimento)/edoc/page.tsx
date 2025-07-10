import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { ButtonModal } from "./components/buttonModal";
import { columns } from "./components/columns";

export default async function EdocPage() {
    const session = await auth();
    const atendimentos = await api.atendimentoEdoc.getAtendimentosEdoc()    

    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    return (
        <PageLayout
            index={false}
            link={'/admin'}
            label={'Edoc'}
            description={'Solicitações de parametrizações diversas do sistema eDoc.'}
            notBreadcrumb={false}
        >
            <ButtonModal action={'Novo Atendimento'} data={null}  />            
            <DataTableApp columns={columns} data={atendimentos} /> 
        </PageLayout>
    );
}




