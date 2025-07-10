import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { columns } from "./components/columns";
import { SetorManager } from "./components/setorManager";

export default async function SetoresPage() {
    const session = await auth();
    const setores = await api.setor.getSetores();

    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    return (
        <PageLayout
            index={false}
            link={'/admin'}
            label={'Setores'}
            description={'Listagem de unidades administrativas'}
            notBreadcrumb={false}
        >
            <SetorManager action="Novo Registro" data={null} />
            <DataTableApp columns={columns} data={setores} />
        </PageLayout>
    );
}




