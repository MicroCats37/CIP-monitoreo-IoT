"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NestedMenuItem } from "../NestedMenuItem/NestedMenuItem"
import { linkRoutes } from "./SidebarComponent.data"
import { ThemeToggle } from "../DarkMode/theme-toggle"


export function AppSidebar() {
  return (
    <Sidebar className="h-screen border-r">
      <SidebarHeader className="border-b px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtlBG0gTCz0ut6KaTl1E6aKFoVRXGkvW173A&s"
                alt="Pedro Sotelo"
              />
              <AvatarFallback>PS</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Pedro Sotelo</p>
              <p className="text-xs text-muted-foreground">Usuario CIP</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent className="">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Dashboard IoT
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {linkRoutes.map((route, index) => (
                <SidebarMenuItem key={`${route.title}-${index}`}>
                  <NestedMenuItem
                    item={{
                      title: route.title,
                      url: route.url,
                      icon: route.icon,
                      pages: route.pages,
                    }}
                    level={0}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t px-4 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Dashboard IoT v1.0</span>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
