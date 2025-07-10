import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { ButtonModal } from "./components/buttonModal";
import { columns } from "./components/columns";

export default async function InternoPage() {
    const session = await auth();
    const internos = await api.interno.getInternos();

    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }
    
    return (
        <PageLayout
            index={false}
            link={'/admin'}
            label={'Atendimentos Internos'}
            description={'Listagem de atendimentos realizados dentro do órgão'}
            notBreadcrumb={false}
        >

            <ButtonModal action={'Novo Atendimento'} data={null}  />            
            <DataTableApp columns={columns} data={internos} />
        </PageLayout>
    );
}




