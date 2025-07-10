import { DataTableApp } from "@/components/DataTable";
import PageLayout from "@/components/PageLayout";
import { auth } from "@/server/auth"; // seu arquivo de configuração NextAuth
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { columns } from "./components/columns";
import { ButtonModal } from "./components/buttonModal";

export default async function EnvelopePage() {
    const session = await auth();
    const envelopes = await api.envelope.getEnvelopes()

    if (!session) {
        // Usuário está logado, redirecione ou renderize outra página
        redirect("/");  // redireciona para dashboard, por exemplo
    }

    return (
        <PageLayout
            index={false}
            link={'/admin'}
            label={'Envelopes'}
            description={'Listagem de envelopes disponíveis'}
            notBreadcrumb={false}
        >
            <ButtonModal action={'Novo Envelope'} data={null}  />
            <DataTableApp columns={columns} data={envelopes} />
        </PageLayout>
    );
}




