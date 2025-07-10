import { DataTable } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { redirect } from "next/navigation";

export default async function MovimentacaoPage() {
    const session = await auth();

    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    return (
        <PageLayout
            index={false}
            link={'/admin'}
            label={'Movimentação do estoque'}
            description={'Controle de entrada/saída de periféricos dentro do órgão'}
            notBreadcrumb={false}
        >
            {/* <DataTable columns={columns} data={customers} /> */}
        </PageLayout>
    );
}




