import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { columns } from "./components/columns";
import { ButtonModal } from "./components/buttonModal";

export default async function TelefonePage() {
    const session = await auth();
    const telefones = await api.telefone.getTelefones();       

    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    return (
        <PageLayout
            index={false}
            link={'/admin'}
            label={'Telefones'}
            description={'Listagem de ramais disponíveis no órgão'}
            notBreadcrumb={false}
        >
            <ButtonModal action={'Novo Ramal'} data={null}  />
            <DataTableApp columns={columns} data={telefones} />
        </PageLayout>
    );
}




