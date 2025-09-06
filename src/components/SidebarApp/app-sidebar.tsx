"use client"

import * as React from "react"
import {
  ChartArea,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Cadastros",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      role: ["ADMIN"],
      items: [
        {
          title: "Provisão de Adicional",
          url: "/admin/adicional-provisao",
          role: ["ADMIN"],
        },
        {
          title: "Provisão de Perda",
          url: "/admin/provisao-perda",
          role: ["ADMIN"],
        },
        { 
          title: "Operações",
          url: "/admin/operacoes",
          role: ["ADMIN"],
        },
        { 
          title: "Instituições Financeiras",
          url: "/admin/instituicoes-financeiras",
          role: ["ADMIN"],
        },        
        { 
          title: "Tipos de Recuperação",
          url: "/admin/tipos-recuperacao",
          role: ["ADMIN"],
        },
      ],
    },
    {
      title: "Gestão",
      url: "#",
      icon: ChartArea,
      isActive: true, 
      role: ["ADMIN","USER"],           
      items: [
        {
          title: "Clientes",
          url: "/admin/clientes",
          role: ["ADMIN"],
        },          
        {
          title: "Reestruturação de Passivo",
          url: "/admin/demandas",
          role: ["ADMIN","USER"],                     
        },                 
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
