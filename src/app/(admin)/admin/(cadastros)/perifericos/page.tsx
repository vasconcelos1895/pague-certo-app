import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { columns } from "./components/columns";
import { ButtonModal } from "./components/buttonModal";

export default async function PerifericoPage() {
    const session = await auth();
    const perifericos = await api.periferico.getPerifericos();    

    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    return (
        <PageLayout
            index={false}
            link={'/admin'}
            label={'Periféricos'}
            description={'Listagem de periféricos que podem ser armazenados em estoque'}
            notBreadcrumb={false}
        >
            <ButtonModal action={'Novo Periférico'} data={null} />
            <DataTableApp columns={columns} data={perifericos} />
        </PageLayout>
    );
}




