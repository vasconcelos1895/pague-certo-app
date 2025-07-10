"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogIn,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { signIn, signOut, useSession } from 'next-auth/react'
import { redirect } from "next/navigation"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { status, data } = useSession();

  async function handleLogin(){
    await signIn();
  }

  async function handleLogout(){
    await signOut();
    await redirect('/');
  }  

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {status == "unauthenticated" && (<>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs">Fazer login</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </>)}

              {status == "authenticated" && (<>
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={data?.user.image} alt={data?.user.name} />
                  {/* <AvatarFallback className="rounded-lg">{data?.user.id}</AvatarFallback> */}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{data?.user.name}</span>
                  <span className="truncate text-xs">{data?.user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </>)}              
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {status == "authenticated" && (
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Sair
              </DropdownMenuItem>            
            )}

            {status == "unauthenticated" && (
              <DropdownMenuItem onClick={handleLogin}>
                <LogIn />
                Autenticar
              </DropdownMenuItem>            
            )}            
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
