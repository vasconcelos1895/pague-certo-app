import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { columns } from "./components/columns";
import { ButtonModal } from "./components/buttonModal";

export default async function PastaFuncionalPage() {
    const session = await auth();
    const pastas = await api.pastaFuncional.getPastasFuncionais();    

    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    return (
        <PageLayout
            index={false}
            link={'/admin'}
            label={'Pastas Funcionais'}
            description={'Listagem de pastas funcionais da PMCG'}
            notBreadcrumb={false}
        >
            <ButtonModal action={'Nova Pasta Funcional'} data={null}  />
            <DataTableApp columns={columns} data={pastas} />
        </PageLayout>
    );
}




