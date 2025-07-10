import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { ButtonModal } from "./components/buttonModal";
import { columns } from "./components/columns";

export default async function MonitoresPage() {
    const session = await auth();
    const monitores = await api.monitor.getMonitores();

    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    return (
        <PageLayout
            index={false}
            link={'/admin'}
            label={'Monitores'}
            description={'Listagem de monitores disponíveis no órgão'}
            notBreadcrumb={false}
        >
            <ButtonModal action={'Novo Monitor'} data={null}  />
            <DataTableApp columns={columns} data={monitores} />
        </PageLayout>
    );
}




