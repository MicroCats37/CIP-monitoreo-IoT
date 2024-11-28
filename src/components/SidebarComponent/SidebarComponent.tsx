'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { linkRoutes  } from "./SidebarComponent.data"

import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar() {

  const pathname = usePathname();
  return (
    <>
    <Sidebar>
    <SidebarHeader className="border-b px-4 py-2">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">user</p>
            <p className="text-xs text-muted-foreground">user@cst.com</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">

              {linkRoutes.map((route) => (
                <SidebarMenuItem key={route.title} className="w-full">
                  
                {
                  route.pages? (
                    <Accordion type="single" collapsible key={`acordeon-${route.title}`} >
                      <AccordionItem value="item-1">
                          <AccordionTrigger className="p-0 pr-2 bg-sidebar-accent rounded-md ">
                              <SidebarMenuButton asChild >
                                <Link href={route.url} passHref>
                                  <route.icon />
                                  <span >{route.title}</span>
                                </Link>
                              </SidebarMenuButton>
                          </AccordionTrigger>
                          <AccordionContent className="py-2">
                            {
                              route.pages.map((page)=>(
                                <div key={page.url} className="w-full flex text-center items-center justify-center h-auto">
                                  <Link href={page.url} className="p-4 cursor-pointer" passHref prefetch={false}>
                                    <span className={`px-4 py-2 rounded ${
                                      pathname===page.url ? 'bg-black text-white' : 'bg-gray-200 text-black'
                                    }`}>{page.title}</span>
                                  </Link>
                                </div>
                              ))
                            }
                          </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ): (
                      <SidebarMenuButton  asChild>
                        <Link href={route.url}>
                          <route.icon />
                          <span>{route.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    
                  )           
                }
                
                </SidebarMenuItem> 

              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    </>
    
  )
}

/*
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>*/