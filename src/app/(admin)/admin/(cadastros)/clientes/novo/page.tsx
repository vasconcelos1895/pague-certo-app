"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ClientForm } from "../components/crud-form";
import { AddressForm } from "../components/address-form";
import { api } from "@/trpc/react";
import { type AddressFormValues, type CustomerFormValues } from "@/lib/validators/customer";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import PageLayout from "@/components/PageLayout";


const defaultAddressValues: AddressFormValues = {
  clientId: "",     // será preenchido dinamicamente
  kind: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  postal_code: "",
  country: "BR",
};


export default function ClientPage() {

  return (

    <PageLayout
      index={false}
      link="/admin/clientes"
      label="Novo Cliente"
      description="Registro de novo cliente"
      notBreadcrumb={false}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 space-y-8">
        <ClientForm
          customer={null}
        />
      </div>
    </PageLayout>    
  );
}
