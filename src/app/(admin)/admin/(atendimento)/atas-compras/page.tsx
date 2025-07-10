import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { ButtonModal } from "./components/buttonModal";
import { columns } from "./components/columns";

export default async function AtasComprasPage() {
    const session = await auth();
    const atas = await api.ata.getAtas();

    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    return (
        <PageLayout
            index={false}
            link={'/admin'}
            label={'Processos de TIC'}
            description={'Andamento dos processos relacionados a TIC'}
            notBreadcrumb={false}
        >
            <ButtonModal action={'Novo Processo'} data={null}  />            
            <DataTableApp columns={columns} data={atas} />
        </PageLayout>
    );
}




