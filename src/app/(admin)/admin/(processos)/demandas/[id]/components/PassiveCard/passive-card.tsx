'use client'; 

import { api } from "@/trpc/react";
import type {  PassiveRestructuring } from "@prisma/client";
import ItemCard from "./item-card";



export default function PassiveCard({passiveRestructuring}: {passiveRestructuring: PassiveRestructuring[]}) {  
    const { data: additionalProvisionLevel, isLoading } = api.additionalProvisionLevel.list.useQuery()

    return (
        passiveRestructuring?.map((p,index) => (
            <div key={index}>
                <ItemCard passiveRestructuring={p} additionalProvisionLevel={additionalProvisionLevel} index={index} />
            </div>
        ))
    );
}
