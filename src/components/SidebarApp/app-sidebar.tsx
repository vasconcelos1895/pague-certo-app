"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChartArea,
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
          title: "Pastas Funcionais",
          url: "/admin/pastas-funcionais",
        },
        {
          title: "Envelopes",
          url: "/admin/envelopes",
        },
      ],
    },
    {
      title: "Gestão",
      url: "#",
      icon: ChartArea,
      isActive: true,      
      items: [
        {
          title: "Produtividade",
          url: "/gestao/produtividade",
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
