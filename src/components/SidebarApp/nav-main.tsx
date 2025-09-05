"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    role: string[]
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      role: string[]
    }[]
  }[]
}) {
  const { data: session , status} = useSession()

  if (status === "loading") {
    return <div className="p-4">
      <div className="h-4 bg-gray-300 rounded w-2/4 mb-4 animate-pulse"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 ml-1 animate-pulse"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 ml-1 animate-pulse"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 ml-1 animate-pulse"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 ml-1 animate-pulse"></div>
    </div>;
  }  

  const userRole = session?.user?.role ?? "CONSULTA"; // Default to "GUEST" if no role is found

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Plataforma</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          item.role.indexOf(userRole) !== -1 &&
          <Collapsible
            key={item.title}
            asChild
            disabled={item.role.indexOf(userRole) === -1}
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} disabled={item.role.indexOf(userRole) === -1}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    subItem.role.indexOf(userRole) !== -1 &&
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url} className={subItem.role.indexOf(userRole) === -1 ? "pointer-events-none opacity-50" : ""}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}