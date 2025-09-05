import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { columns } from "./components/columns";
import { ButtonModal } from "./components/buttonModal";

export default async function Page() {
    const session = await auth();
    //const computadores = await api.computador.getComputadores();    

    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    return (
        <PageLayout
            index={false}
            link={'/admin'}
            label={'Computadores'}
            description={'Listagem de computadores do órgão'}
            notBreadcrumb={false}
        >
            <ButtonModal action={'Novo Registro'} data={null}  />
            <DataTableApp columns={columns} data={[]} />
        </PageLayout>
    );
}




