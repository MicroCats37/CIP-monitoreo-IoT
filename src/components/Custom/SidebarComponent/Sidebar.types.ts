import { LucideIcon } from "lucide-react"

export interface LinkRouteType {
    title:string,
    url:string,
    icon:LucideIcon
    pages?:PageType[]
  }
  
export interface PageType{
    title:string,
    url:string,
}