"use client";

import { ClientForm } from "../components/crud-form";
import { AddressForm } from "../components/address-form";
import { api } from "@/trpc/react";
import React from "react";
import PageLayout from "@/components/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TabContent from "@/components/TabContent";

export default function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { data: customerData, isLoading } = api.customer.getById.useQuery({
    id,
  });  

  //const { data: addressData } = api.address.getByClientId.useQuery({ clientId: id });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!customerData) {
    return <div>Cliente não encontrado.</div>;
  }  


  return (
    <PageLayout
      index={false}
      link="/admin/clientes"
      label={`Cliente: ${customerData?.name}`}
      description={`Atualizar dados do cliente (${customerData?.document})`}
      notBreadcrumb={false}
    >
      <TabContent
        activeTab="dados-pessoais"
        dataTab={[
          {
            name: "dados-pessoais",
            ariallabel: "Dados Pessoais",
            content: 
              <Card className="border-none shadow-none">
                  <CardHeader>
                      <CardTitle>Dados Pesosais</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="flex flex-col w-full md:max-w-xl">
                        <ClientForm customer={customerData} />
                      </div>
                  </CardContent>
              </Card>
          },
          {
            name: "endereco",
            ariallabel: "Endereço",
            content: 
              <Card className="border-none shadow-none">
                  <CardHeader>
                      <CardTitle>Endereço</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="flex flex-col w-full md:max-w-xl">
                        <AddressForm address={customerData.address ?? null} clientId={id} />
                      </div>                    
                  </CardContent>
              </Card> 
          }]}
      />     
    </PageLayout>
  );
}
