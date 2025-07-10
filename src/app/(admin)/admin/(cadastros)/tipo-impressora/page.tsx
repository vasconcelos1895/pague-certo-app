import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { ButtonModal } from "./components/buttonModal";
import { columns } from "./components/columns";

export default async function TipoImpressoraPage() {
    const session = await auth();
    const tipos_impressoras = await api.tipoImpressora.getTiposImpressoras()

    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    return (
        <PageLayout
            index={false}
            link={'/admin'}
            label={'Tipo de Impressora'}
            description={'Listagem de modelos de impressoras'}
            notBreadcrumb={false}
        >
            <ButtonModal action="Novo Registro" data={null} />            
            <DataTableApp columns={columns} data={tipos_impressoras} />
        </PageLayout>
    );
}




