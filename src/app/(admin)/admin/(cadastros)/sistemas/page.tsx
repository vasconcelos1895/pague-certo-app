import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { ButtonModal } from "./components/buttonModal";
import { columns } from "./components/columns";

export default async function SistemaPage() {
    const session = await auth();
    const sistemas = await api.sistema.getSistemas()

    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    return (
        <PageLayout
            index={false}
            link={'/admin'}
            label={'Sistema'}
            description={'Listagem de sistemas utilizados pelo órgão'}
            notBreadcrumb={false}
        >
            <ButtonModal action="Novo Registro" data={null} />                  
            <DataTableApp columns={columns} data={sistemas} />
        </PageLayout>
    );
}




