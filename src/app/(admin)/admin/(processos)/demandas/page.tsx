import PageLayout from "@/components/PageLayout";
import PageClient from "./components/page-client";
import { api } from "@/trpc/server";

export default async function Page() {
  const demands = await api.demand.list();
  const clients = await api.customer.list();

  // ✅ Optimistic Cr

  return (
    <PageLayout
      index={false}
      link={"/admin"}
      label={"Demandas"}
      description={"Listagem de demandas de reestruturação de passivo"}
      notBreadcrumb={false}
    >
      <PageClient demands={demands ?? []} clients={clients ?? []} />
    </PageLayout>
  );
}