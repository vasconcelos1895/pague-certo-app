"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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
      items: [
        {
          title: "Computadores",
          url: "/admin/computadores",
        },
        {
          title: "Telefones",
          url: "/admin/telefones",
        },
        {
          title: "Impressoras",
          url: "/admin/impressoras",
        },
        {
          title: "Monitores",
          url: "/admin/monitores",
        },        
      ],
    },
    {
      title: "Atendimentos",
      url: "#",
      icon: Bot,
      isActive: true,      
      items: [
        {
          title: "Interno",
          url: "/admin/internos",
        },
        {
          title: "eDoc",
          url: "/admin/edoc",
        },
        {
          title: "Chamados (AGETEC)",
          url: "/admin/chamados",
        },
        {
          title: "Acessos",
          url: "/admin/acessos",
        },  
        {
          title: "Atas/Compras",
          url: "/admin/atas-compras",
        },                 
      ],
    },
    {
      title: "Estoque",
      url: "#",
      icon: BookOpen,
      isActive: true,      
      items: [
        {
          title: "Movimentação",
          url: "/admin/movimentacao",
        },
      ],
    },
    {
      title: "Configuração",
      url: "#",
      icon: Settings2,
      isActive: true,
      items: [
        {
          title: "Setores",
          url: "/admin/setores",
        },
        {
          title: "Tipos de Impressoras",
          url: "/admin/tipo-impressora",
        },
        {
          title: "Sistemas",
          url: "/admin/sistemas",
        },
        {
          title: "Servidores",
          url: "#",
        },
        {
          title: "Periféricos",
          url: "/admin/perifericos",
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
